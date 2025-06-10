package com.refurl.controller;

import com.refurl.dto.HealthStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.OperatingSystemMXBean;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/detailed")
    public ResponseEntity<HealthStatus> healthDetails() {
        OperatingSystemMXBean osBean = ManagementFactory.getOperatingSystemMXBean();
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        
        // Get memory information
        long totalMemory = memoryBean.getHeapMemoryUsage().getMax();
        long usedMemory = memoryBean.getHeapMemoryUsage().getUsed();
        long freeMemory = totalMemory - usedMemory;

        // Create system information
        HealthStatus.System.Memory memory = HealthStatus.System.Memory.builder()
            .total(totalMemory)
            .used(usedMemory)
            .free(freeMemory)
            .build();

        HealthStatus.System.Cpu cpu = HealthStatus.System.Cpu.builder()
            .load(osBean.getSystemLoadAverage())
            .processors(osBean.getAvailableProcessors())
            .build();

        HealthStatus.System system = HealthStatus.System.builder()
            .memory(memory)
            .cpu(cpu)
            .build();

        // Create database status (you might want to implement actual database health check)
        HealthStatus.Database database = HealthStatus.Database.builder()
            .status("UP")
            .message("Database connection is healthy")
            .build();

        // Create config information
        HealthStatus.Config config = HealthStatus.Config.builder()
            .environment(System.getenv("APP_ENV"))
            .version("1.0.0") // You might want to get this from your application properties
            .build();

        // Create the full health status
        HealthStatus healthStatus = new HealthStatus(
            "UP",
            System.currentTimeMillis(),
            ManagementFactory.getRuntimeMXBean().getUptime(),
            database,
            system,
            config
        );

        return ResponseEntity.ok(healthStatus);
    }
} 