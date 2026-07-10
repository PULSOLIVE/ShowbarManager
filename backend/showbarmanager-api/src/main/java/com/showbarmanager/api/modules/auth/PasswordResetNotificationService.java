package com.showbarmanager.api.modules.auth;

import com.showbarmanager.api.modules.notifications.sms.SmsNotificationService;
import com.showbarmanager.api.modules.users.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class PasswordResetNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(PasswordResetNotificationService.class);

    private final JavaMailSender mailSender;
    private final SmsNotificationService smsNotificationService;
    private final String fromAddress;

    public PasswordResetNotificationService(
            JavaMailSender mailSender,
            SmsNotificationService smsNotificationService,
            @Value("${app.mail.from:no-reply@showbarmanager.local}") String fromAddress
    ) {
        this.mailSender = mailSender;
        this.smsNotificationService = smsNotificationService;
        this.fromAddress = fromAddress;
    }

    public void sendResetCode(
            User user,
            String channel,
            String destination,
            String code,
            int expirationMinutes
    ) {
        if ("sms".equals(channel)) {
            sendSms(user, destination, code, expirationMinutes);
            return;
        }

        sendEmail(user, destination, code, expirationMinutes);
    }

    private void sendEmail(User user, String email, String code, int expirationMinutes) {
        String subject = "Codigo de redefinicao de senha - Showbar Manager";
        String body = buildEmailBody(user, code, expirationMinutes);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(email);
        message.setSubject(subject);
        message.setText(body);

        try {
            mailSender.send(message);
            logger.info("password-reset-email-sent to={} user={}", email, user.getEmail());
        } catch (MailException exception) {
            logger.error("password-reset-email-failed to={} user={}", email, user.getEmail(), exception);
            throw exception;
        }
    }

    private void sendSms(User user, String phone, String code, int expirationMinutes) {
        String message = "Showbar Manager: seu codigo de redefinicao de senha e %s. Valido por %d minutos. Se nao foi voce, ignore esta mensagem."
                .formatted(code, expirationMinutes);

        logger.info("password-reset-sms-dispatch user={} to={}", user.getEmail(), phone);
        smsNotificationService.sendOtp(phone, message, code);
    }

    private String buildEmailBody(User user, String code, int expirationMinutes) {
        return """
                Ola, %s.

                Recebemos uma solicitacao para redefinir a senha da sua conta no Showbar Manager.

                Use o codigo abaixo para confirmar a redefinicao:

                %s

                Este codigo e valido por %d minutos. Por seguranca, nao compartilhe este codigo com ninguem.

                Se voce nao solicitou esta alteracao, ignore este e-mail. A sua senha atual continuara valida.

                Atenciosamente,
                Equipe Showbar Manager
                """.formatted(user.getName(), code, expirationMinutes);
    }
}