package com.refurl.service;

import com.refurl.dto.HealthStatus;
import com.refurl.dto.DetailedHealthStatus;
import org.springframework.stereotype.Service;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.OperatingSystemMXBean;
import java.lang.management.RuntimeMXBean;

@Service
public class HealthService {

    public HealthStatus getStatus() {
        RuntimeMXBean runtimeMXBean = ManagementFactory.getRuntimeMXBean();
        OperatingSystemMXBean osMXBean = ManagementFactory.getOperatingSystemMXBean();
        MemoryMXBean memoryMXBean = ManagementFactory.getMemoryMXBean();

        HealthStatus.Database db = new HealthStatus.Database("UP", "Connected");
        HealthStatus.System.Memory mem = new HealthStatus.System.Memory(
                memoryMXBean.getHeapMemoryUsage().getMax(),
                memoryMXBean.getHeapMemoryUsage().getUsed(),
                memoryMXBean.getHeapMemoryUsage().getMax() - memoryMXBean.getHeapMemoryUsage().getUsed()
        );
        HealthStatus.System.Cpu cpu = new HealthStatus.System.Cpu(
                osMXBean.getSystemLoadAverage(),
                osMXBean.getAvailableProcessors()
        );
        HealthStatus.System sys = new HealthStatus.System(mem, cpu);
        HealthStatus.Config config = new HealthStatus.Config(
                System.getProperty("spring.profiles.active", "default"),
                "1.0.0"
        );
        return new HealthStatus(
                "UP",
                System.currentTimeMillis(),
                runtimeMXBean.getUptime(),
                db,
                sys,
                config
        );
    }

    public DetailedHealthStatus getDetailedStatus() {
        HealthStatus basicStatus = getStatus();
        RuntimeMXBean runtimeMXBean = ManagementFactory.getRuntimeMXBean();
        OperatingSystemMXBean osMXBean = ManagementFactory.getOperatingSystemMXBean();
        MemoryMXBean memoryMXBean = ManagementFactory.getMemoryMXBean();

        DetailedHealthStatus.System.Memory mem = new DetailedHealthStatus.System.Memory(
                memoryMXBean.getHeapMemoryUsage().getMax(),
                memoryMXBean.getHeapMemoryUsage().getUsed(),
                memoryMXBean.getHeapMemoryUsage().getMax() - memoryMXBean.getHeapMemoryUsage().getUsed(),
                (double) memoryMXBean.getHeapMemoryUsage().getUsed() / memoryMXBean.getHeapMemoryUsage().getMax() * 100
        );
        DetailedHealthStatus.System.Cpu cpu = new DetailedHealthStatus.System.Cpu(
                osMXBean.getSystemLoadAverage(),
                osMXBean.getAvailableProcessors(),
                osMXBean.getArch()
        );
        DetailedHealthStatus.System.Os os = new DetailedHealthStatus.System.Os(
                osMXBean.getName(),
                osMXBean.getVersion(),
                osMXBean.getArch()
        );
        DetailedHealthStatus.System sys = new DetailedHealthStatus.System(mem, cpu, os);
        DetailedHealthStatus.Process proc = new DetailedHealthStatus.Process(
                ProcessHandle.current().pid(),
                runtimeMXBean.getUptime(),
                memoryMXBean.getHeapMemoryUsage().getUsed(),
                Thread.activeCount()
        );
        return new DetailedHealthStatus(
                basicStatus.getStatus(),
                basicStatus.getTimestamp(),
                basicStatus.getUptime(),
                basicStatus.getDatabase(),
                sys,
                proc
        );
    }
} 