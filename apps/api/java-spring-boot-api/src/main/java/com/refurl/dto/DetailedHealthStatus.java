package com.refurl.dto;

import java.util.Map;

public class DetailedHealthStatus {
    private String status;
    private long timestamp;
    private long uptime;
    private HealthStatus.Database database;
    private System system;
    private Map<String, String> networkInterfaces;
    private Process process;

    public DetailedHealthStatus() {}
    public DetailedHealthStatus(String status, long timestamp, long uptime, HealthStatus.Database database, System system, Process process) {
        this.status = status;
        this.timestamp = timestamp;
        this.uptime = uptime;
        this.database = database;
        this.system = system;
        this.process = process;
    }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
    public long getUptime() { return uptime; }
    public void setUptime(long uptime) { this.uptime = uptime; }
    public HealthStatus.Database getDatabase() { return database; }
    public void setDatabase(HealthStatus.Database database) { this.database = database; }
    public System getSystem() { return system; }
    public void setSystem(System system) { this.system = system; }
    public Process getProcess() { return process; }
    public void setProcess(Process process) { this.process = process; }

    public static class System {
        private Memory memory;
        private Cpu cpu;
        private Os os;
        public System() {}
        public System(Memory memory, Cpu cpu, Os os) {
            this.memory = memory;
            this.cpu = cpu;
            this.os = os;
        }
        public Memory getMemory() { return memory; }
        public void setMemory(Memory memory) { this.memory = memory; }
        public Cpu getCpu() { return cpu; }
        public void setCpu(Cpu cpu) { this.cpu = cpu; }
        public Os getOs() { return os; }
        public void setOs(Os os) { this.os = os; }
        public static class Memory {
            private long total;
            private long used;
            private long free;
            private double usagePercentage;
            public Memory() {}
            public Memory(long total, long used, long free, double usagePercentage) {
                this.total = total;
                this.used = used;
                this.free = free;
                this.usagePercentage = usagePercentage;
            }
            public long getTotal() { return total; }
            public void setTotal(long total) { this.total = total; }
            public long getUsed() { return used; }
            public void setUsed(long used) { this.used = used; }
            public long getFree() { return free; }
            public void setFree(long free) { this.free = free; }
            public double getUsagePercentage() { return usagePercentage; }
            public void setUsagePercentage(double usagePercentage) { this.usagePercentage = usagePercentage; }
        }
        public static class Cpu {
            private double load;
            private int processors;
            private String architecture;
            public Cpu() {}
            public Cpu(double load, int processors, String architecture) {
                this.load = load;
                this.processors = processors;
                this.architecture = architecture;
            }
            public double getLoad() { return load; }
            public void setLoad(double load) { this.load = load; }
            public int getProcessors() { return processors; }
            public void setProcessors(int processors) { this.processors = processors; }
            public String getArchitecture() { return architecture; }
            public void setArchitecture(String architecture) { this.architecture = architecture; }
        }
        public static class Os {
            private String name;
            private String version;
            private String architecture;
            public Os() {}
            public Os(String name, String version, String architecture) {
                this.name = name;
                this.version = version;
                this.architecture = architecture;
            }
            public String getName() { return name; }
            public void setName(String name) { this.name = name; }
            public String getVersion() { return version; }
            public void setVersion(String version) { this.version = version; }
            public String getArchitecture() { return architecture; }
            public void setArchitecture(String architecture) { this.architecture = architecture; }
        }
    }
    public static class Process {
        private long pid;
        private long uptime;
        private long memoryUsage;
        private int threadCount;
        public Process() {}
        public Process(long pid, long uptime, long memoryUsage, int threadCount) {
            this.pid = pid;
            this.uptime = uptime;
            this.memoryUsage = memoryUsage;
            this.threadCount = threadCount;
        }
        public long getPid() { return pid; }
        public void setPid(long pid) { this.pid = pid; }
        public long getUptime() { return uptime; }
        public void setUptime(long uptime) { this.uptime = uptime; }
        public long getMemoryUsage() { return memoryUsage; }
        public void setMemoryUsage(long memoryUsage) { this.memoryUsage = memoryUsage; }
        public int getThreadCount() { return threadCount; }
        public void setThreadCount(int threadCount) { this.threadCount = threadCount; }
    }
} 