package com.etask.userservice.service;

import org.springframework.stereotype.Service;

import com.etask.userservice.entity.TaskDTO;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import java.util.List;

import jakarta.mail.MessagingException;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender javaMailSender;

    public void sendOtp(String to, String otp) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setTo(to);
            helper.setSubject("Your OTP Code");
            helper.setText("Your OTP code is: " + otp + "\nIt expires in 5 minutes.");
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new IllegalStateException("failed to send email");
        }
    }

    public void sendReminder(String to, List<TaskDTO> tasks) {
        try {
            if (tasks != null && !tasks.isEmpty()) {
                MimeMessage mimeMessage = javaMailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
                helper.setTo(to);
                helper.setSubject("Reminder: Pending Tasks Near Expiry");

                StringBuilder body = new StringBuilder();
                body.append("Hello,\n\n");
                body.append("You have the following tasks that are near to expire:\n\n");

                int count = 1;
                for (TaskDTO task : tasks) {
                    body.append("Task ").append(count++).append(":\n");
                    body.append("  Title: ").append(task.getTitle()).append("\n");
                    body.append("  Description: ").append(task.getDescription()).append("\n");
                    body.append("  Status: ").append(task.getStatus()).append("\n");
                    body.append("  Priority: ").append(task.getPriority()).append("\n");
                    body.append("  Created Date: ").append(task.getCreatedDate()).append("\n");
                    body.append("  Due Date: ").append(task.getDueDate()).append("\n");
                    body.append("\n");
                }

                body.append("Please take the necessary actions before the due dates.\n\n");
                body.append("Best regards,\nTask Manager Team");

                helper.setText(body.toString());
                javaMailSender.send(mimeMessage);
            }
        } catch (MessagingException e) {
            throw new IllegalStateException("failed to send email");
        }
    }
}
