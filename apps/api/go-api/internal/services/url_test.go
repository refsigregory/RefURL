package services

import (
	"context"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/refsigregory/refurl/apps/api/go-api/internal/models"
)

func setupTestDB(t *testing.T) (*gorm.DB, sqlmock.Sqlmock) {
	db, mock, err := sqlmock.New()
	require.NoError(t, err)

	dialector := postgres.New(postgres.Config{
		Conn:       db,
		DriverName: "postgres",
	})

	gormDB, err := gorm.Open(dialector, &gorm.Config{})
	require.NoError(t, err)

	return gormDB, mock
}

func TestURLService_CreateURL(t *testing.T) {
	tests := []struct {
		name    string
		userID  uint
		req     *models.CreateURLRequest
		mock    func(mock sqlmock.Sqlmock)
		want    *models.URLResponse
		wantErr bool
	}{
		{
			name:   "successful creation",
			userID: 1,
			req: &models.CreateURLRequest{
				OriginalURL: "https://example.com",
				Title:       "Example",
				ShortCode:   "abc123",
			},
			mock: func(mock sqlmock.Sqlmock) {
				mock.ExpectBegin()
				mock.ExpectQuery(`INSERT INTO "urls"`).
					WithArgs("https://example.com", "abc123", "Example", uint(1), 0, sqlmock.AnyArg(), sqlmock.AnyArg()).
					WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1))
				mock.ExpectCommit()
			},
			want: &models.URLResponse{
				ID:          1,
				OriginalURL: "https://example.com",
				Title:       "Example",
				ShortCode:   "abc123",
				Clicks:      0,
			},
			wantErr: false,
		},
		{
			name:   "database error",
			userID: 1,
			req: &models.CreateURLRequest{
				OriginalURL: "https://example.com",
				Title:       "Example",
				ShortCode:   "abc123",
			},
			mock: func(mock sqlmock.Sqlmock) {
				mock.ExpectBegin()
				mock.ExpectQuery(`INSERT INTO "urls"`).
					WillReturnError(gorm.ErrInvalidDB)
				mock.ExpectRollback()
			},
			want:    nil,
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			db, mock := setupTestDB(t)
			tt.mock(mock)

			service := NewURLService(db)
			got, err := service.CreateURL(context.Background(), tt.userID, tt.req)

			if tt.wantErr {
				assert.Error(t, err)
				return
			}

			assert.NoError(t, err)
			assert.NotNil(t, got)
			assert.Equal(t, tt.want.OriginalURL, got.OriginalURL)
			assert.Equal(t, tt.want.Title, got.Title)
			assert.Equal(t, tt.want.ShortCode, got.ShortCode)
			assert.Equal(t, tt.want.Clicks, got.Clicks)
		})
	}
}

func TestURLService_GetURLByID(t *testing.T) {
	tests := []struct {
		name    string
		userID  uint
		urlID   uint
		mock    func(mock sqlmock.Sqlmock)
		want    *models.URLResponse
		wantErr bool
	}{
		{
			name:   "successful retrieval",
			userID: 1,
			urlID:  1,
			mock: func(mock sqlmock.Sqlmock) {
				rows := sqlmock.NewRows([]string{"id", "original_url", "title", "short_code", "owner", "clicks", "created_at", "clicks_at"}).
					AddRow(1, "https://example.com", "Example", "abc123", 1, 0, time.Now(), time.Now())
				mock.ExpectQuery(`SELECT \* FROM "urls" WHERE id = \$1 AND owner = \$2 ORDER BY "urls"\."id" LIMIT \$3`).
					WithArgs(1, 1, 1).
					WillReturnRows(rows)
			},
			want: &models.URLResponse{
				ID:          1,
				OriginalURL: "https://example.com",
				Title:       "Example",
				ShortCode:   "abc123",
				Clicks:      0,
			},
			wantErr: false,
		},
		{
			name:   "url not found",
			userID: 1,
			urlID:  999,
			mock: func(mock sqlmock.Sqlmock) {
				mock.ExpectQuery(`SELECT \* FROM "urls" WHERE id = \$1 AND owner = \$2`).
					WithArgs(999, 1).
					WillReturnError(gorm.ErrRecordNotFound)
			},
			want:    nil,
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			db, mock := setupTestDB(t)
			tt.mock(mock)

			service := NewURLService(db)
			got, err := service.GetURLByID(context.Background(), tt.userID, tt.urlID)

			if tt.wantErr {
				assert.Error(t, err)
				return
			}

			assert.NoError(t, err)
			assert.NotNil(t, got)
			assert.Equal(t, tt.want.OriginalURL, got.OriginalURL)
			assert.Equal(t, tt.want.Title, got.Title)
			assert.Equal(t, tt.want.ShortCode, got.ShortCode)
		})
	}
}

func TestURLService_DeleteURL(t *testing.T) {
	tests := []struct {
		name    string
		userID  uint
		urlID   uint
		mock    func(mock sqlmock.Sqlmock)
		wantErr bool
	}{
		{
			name:   "successful deletion",
			userID: 1,
			urlID:  1,
			mock: func(mock sqlmock.Sqlmock) {
				mock.ExpectBegin()
				mock.ExpectExec(`DELETE FROM "urls" WHERE id = \$1 AND owner = \$2`).
					WithArgs(1, 1).
					WillReturnResult(sqlmock.NewResult(0, 1))
				mock.ExpectCommit()
			},
			wantErr: false,
		},
		{
			name:   "url not found",
			userID: 1,
			urlID:  999,
			mock: func(mock sqlmock.Sqlmock) {
				mock.ExpectBegin()
				mock.ExpectExec(`DELETE FROM "urls" WHERE id = \$1 AND owner = \$2`).
					WithArgs(999, 1).
					WillReturnResult(sqlmock.NewResult(0, 0))
				mock.ExpectCommit()
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			db, mock := setupTestDB(t)
			tt.mock(mock)

			service := NewURLService(db)
			err := service.DeleteURL(context.Background(), tt.userID, tt.urlID)

			if tt.wantErr {
				assert.Error(t, err)
				return
			}

			assert.NoError(t, err)
		})
	}
}
