package services

import (
	"context"
	"errors"
	"time"

	"github.com/refsigregory/refurl/apps/api/go-api/internal/models"
	"gorm.io/gorm"
)

type URLService struct {
	db *gorm.DB
}

func NewURLService(db *gorm.DB) *URLService {
	return &URLService{db: db}
}

func (s *URLService) CreateURL(ctx context.Context, userID uint, req *models.CreateURLRequest) (*models.URLResponse, error) {
	url := &models.URL{
		OriginalURL: req.OriginalURL,
		Title:       req.Title,
		ShortCode:   req.ShortCode,
		Owner:       userID,
		Clicks:      0,
		ClicksAt:    time.Now(),
	}

	if err := s.db.Create(url).Error; err != nil {
		return nil, err
	}

	return &models.URLResponse{
		ID:          url.ID,
		OriginalURL: url.OriginalURL,
		ShortCode:   url.ShortCode,
		Title:       url.Title,
		Clicks:      url.Clicks,
		CreatedAt:   url.CreatedAt,
		ClicksAt:    url.ClicksAt,
	}, nil
}

func (s *URLService) GetURLByID(ctx context.Context, userID uint, id uint) (*models.URLResponse, error) {
	var url models.URL
	if err := s.db.Where("id = ? AND owner = ?", id, userID).First(&url).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("url not found")
		}
		return nil, err
	}

	return &models.URLResponse{
		ID:          url.ID,
		OriginalURL: url.OriginalURL,
		ShortCode:   url.ShortCode,
		Title:       url.Title,
		Clicks:      url.Clicks,
		CreatedAt:   url.CreatedAt,
		ClicksAt:    url.ClicksAt,
	}, nil
}

func (s *URLService) GetUserURLs(ctx context.Context, userID uint) ([]models.URLResponse, error) {
	var urls []models.URL
	if err := s.db.Where("owner = ?", userID).Find(&urls).Error; err != nil {
		return nil, err
	}

	responses := make([]models.URLResponse, len(urls))
	for i, url := range urls {
		responses[i] = models.URLResponse{
			ID:          url.ID,
			OriginalURL: url.OriginalURL,
			ShortCode:   url.ShortCode,
			Title:       url.Title,
			Clicks:      url.Clicks,
			CreatedAt:   url.CreatedAt,
			ClicksAt:    url.ClicksAt,
		}
	}

	return responses, nil
}

func (s *URLService) UpdateURL(ctx context.Context, userID uint, id uint, req *models.UpdateURLRequest) (*models.URLResponse, error) {
	var url models.URL
	if err := s.db.Where("id = ? AND owner = ?", id, userID).First(&url).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("url not found")
		}
		return nil, err
	}

	url.OriginalURL = req.OriginalURL
	url.Title = req.Title
	url.ShortCode = req.ShortCode

	if err := s.db.Save(&url).Error; err != nil {
		return nil, err
	}

	return &models.URLResponse{
		ID:          url.ID,
		OriginalURL: url.OriginalURL,
		ShortCode:   url.ShortCode,
		Title:       url.Title,
		Clicks:      url.Clicks,
		CreatedAt:   url.CreatedAt,
		ClicksAt:    url.ClicksAt,
	}, nil
}

func (s *URLService) DeleteURL(ctx context.Context, userID uint, id uint) error {
	result := s.db.Unscoped().Where("id = ? AND owner = ?", id, userID).Delete(&models.URL{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("url not found")
	}
	return nil
}

func (s *URLService) GetURLByShortCode(ctx context.Context, shortCode string) (*models.URLResponse, error) {
	var url models.URL
	if err := s.db.Where("short_code = ?", shortCode).First(&url).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("url not found")
		}
		return nil, err
	}

	// Increment clicks and update clicks_at
	url.Clicks++
	url.ClicksAt = time.Now()
	if err := s.db.Save(&url).Error; err != nil {
		return nil, err
	}

	return &models.URLResponse{
		ID:          url.ID,
		OriginalURL: url.OriginalURL,
		ShortCode:   url.ShortCode,
		Title:       url.Title,
		Clicks:      url.Clicks,
		CreatedAt:   url.CreatedAt,
		ClicksAt:    url.ClicksAt,
	}, nil
}
