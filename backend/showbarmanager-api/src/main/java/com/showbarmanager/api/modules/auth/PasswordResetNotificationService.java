package com.showbarmanager.api.modules.auth;

import com.showbarmanager.api.modules.users.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class PasswordResetNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(PasswordResetNotificationService.class);

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
        String subject = "Código de redefinição de senha - Showbar Manager";

        String body = """
                Olá, %s.

                Recebemos uma solicitação para redefinir a senha da sua conta no Showbar Manager.

                O seu código de validação é: %s

                Este código é válido por %d minutos.

                Se não foi você quem solicitou esta alteração, ignore esta mensagem e mantenha a sua conta protegida.

                Showbar Manager
                Sistema de Gestão
                """.formatted(user.getName(), code, expirationMinutes);

        logger.info(
                "password-reset-email to={} subject={} body={}",
                email,
                subject,
                body
        );
    }

    private void sendSms(User user, String phone, String code, int expirationMinutes) {
        String message = """
                Showbar Manager: o seu código de redefinição de senha é %s. Válido por %d minutos. Se não foi você, ignore esta mensagem.
                """.formatted(code, expirationMinutes);

        logger.info(
                "password-reset-sms to={} user={} message={}",
                phone,
                user.getEmail(),
                message
        );
    }
}