package com.etask.gatewayservice.entity;

import java.time.LocalDateTime;

public class SmallTaskDTO {
    private String title;
    private String description;
    private String priority;
    private String status;
    private LocalDateTime dueDate;

    public SmallTaskDTO() {
    }

    public SmallTaskDTO(String title, String description,String priority, String status,
                LocalDateTime dueDate) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status=status;
        this.dueDate = dueDate;
    }


    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getPriority() {
        return priority;
    }

    public String getStatus(){
        return status;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

}