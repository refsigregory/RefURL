package com.refurl.dto;

import lombok.Data;

@Data
public class HealthStatus {
    private String status;
    private long timestamp;
    private long uptime;
    private Database database;
    private System system;
    private Config config;

    public HealthStatus() {}
    public HealthStatus(String status, long timestamp, long uptime, Database database, System system, Config config) {
        this.status = status;
        this.timestamp = timestamp;
        this.uptime = uptime;
        this.database = database;
        this.system = system;
        this.config = config;
    }

    public static class Database {
        private String status;
        private String message;
        public Database() {}
        public Database(String status, String message) {
            this.status = status;
            this.message = message;
        }
        public static DatabaseBuilder builder() { return new DatabaseBuilder(); }
        public static class DatabaseBuilder {
            private String status;
            private String message;
            public DatabaseBuilder status(String status) { this.status = status; return this; }
            public DatabaseBuilder message(String message) { this.message = message; return this; }
            public Database build() { return new Database(status, message); }
        }
        // getters and setters
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class System {
        private Memory memory;
        private Cpu cpu;
        public System() {}
        public System(Memory memory, Cpu cpu) {
            this.memory = memory;
            this.cpu = cpu;
        }
        public static SystemBuilder builder() { return new SystemBuilder(); }
        public static class SystemBuilder {
            private Memory memory;
            private Cpu cpu;
            public SystemBuilder memory(Memory memory) { this.memory = memory; return this; }
            public SystemBuilder cpu(Cpu cpu) { this.cpu = cpu; return this; }
            public System build() { return new System(memory, cpu); }
        }
        // getters and setters
        public Memory getMemory() { return memory; }
        public void setMemory(Memory memory) { this.memory = memory; }
        public Cpu getCpu() { return cpu; }
        public void setCpu(Cpu cpu) { this.cpu = cpu; }
        public static class Memory {
            private long total;
            private long used;
            private long free;
            public Memory() {}
            public Memory(long total, long used, long free) {
                this.total = total;
                this.used = used;
                this.free = free;
            }
            public static MemoryBuilder builder() { return new MemoryBuilder(); }
            public static class MemoryBuilder {
                private long total;
                private long used;
                private long free;
                public MemoryBuilder total(long total) { this.total = total; return this; }
                public MemoryBuilder used(long used) { this.used = used; return this; }
                public MemoryBuilder free(long free) { this.free = free; return this; }
                public Memory build() { return new Memory(total, used, free); }
            }
            // getters and setters
            public long getTotal() { return total; }
            public void setTotal(long total) { this.total = total; }
            public long getUsed() { return used; }
            public void setUsed(long used) { this.used = used; }
            public long getFree() { return free; }
            public void setFree(long free) { this.free = free; }
        }
        public static class Cpu {
            private double load;
            private int processors;
            public Cpu() {}
            public Cpu(double load, int processors) {
                this.load = load;
                this.processors = processors;
            }
            public static CpuBuilder builder() { return new CpuBuilder(); }
            public static class CpuBuilder {
                private double load;
                private int processors;
                public CpuBuilder load(double load) { this.load = load; return this; }
                public CpuBuilder processors(int processors) { this.processors = processors; return this; }
                public Cpu build() { return new Cpu(load, processors); }
            }
            // getters and setters
            public double getLoad() { return load; }
            public void setLoad(double load) { this.load = load; }
            public int getProcessors() { return processors; }
            public void setProcessors(int processors) { this.processors = processors; }
        }
    }

    public static class Config {
        private String environment;
        private String version;
        public Config() {}
        public Config(String environment, String version) {
            this.environment = environment;
            this.version = version;
        }
        public static ConfigBuilder builder() { return new ConfigBuilder(); }
        public static class ConfigBuilder {
            private String environment;
            private String version;
            public ConfigBuilder environment(String environment) { this.environment = environment; return this; }
            public ConfigBuilder version(String version) { this.version = version; return this; }
            public Config build() { return new Config(environment, version); }
        }
        // getters and setters
        public String getEnvironment() { return environment; }
        public void setEnvironment(String environment) { this.environment = environment; }
        public String getVersion() { return version; }
        public void setVersion(String version) { this.version = version; }
    }
    // getters and setters for HealthStatus
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
    public long getUptime() { return uptime; }
    public void setUptime(long uptime) { this.uptime = uptime; }
    public Database getDatabase() { return database; }
    public void setDatabase(Database database) { this.database = database; }
    public System getSystem() { return system; }
    public void setSystem(System system) { this.system = system; }
    public Config getConfig() { return config; }
    public void setConfig(Config config) { this.config = config; }
} 