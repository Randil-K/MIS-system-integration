package com.usermanagement.backend.service;

import com.usermanagement.backend.model.ActivityLog;
import com.usermanagement.backend.model.User;
import com.usermanagement.backend.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityLogService {

    @Autowired
    private ActivityLogRepository activityLogRepository;

    public void logActivity(User user, String action) {
        ActivityLog log = ActivityLog.builder()
                .user(user)
                .action(action)
                .build();
        activityLogRepository.save(log);
    }

    public List<ActivityLog> getGlobalActivities() {
        return activityLogRepository.findAllByOrderByTimestampDesc();
    }

    public List<ActivityLog> getUserActivities(Long userId) {
        return activityLogRepository.findByUserIdOrderByTimestampDesc(userId);
    }
}
