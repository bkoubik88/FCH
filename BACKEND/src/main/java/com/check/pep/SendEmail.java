package com.check.pep;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

public class SendEmail {

	public void sendMailTo(String email, String pw)
			throws AddressException, MessagingException, UnsupportedEncodingException, URISyntaxException {
		final String FROM = "benjamin.koubik@gmx.de";
		final String FROMNAME = "FCH Compliance";

		final String TO = email;

		final String HOST = "mail.gmx.net";
		// Replace smtp_username with your Amazon SES SMTP user name.
		final String SMTP_USERNAME = "benjamin.koubik@gmx.de";

		// Replace smtp_password with your Amazon SES SMTP password.
		final String SMTP_PASSWORD = "3072inneB@";

		final String CONFIGSET = "ConfigSet";
		// The port you will connect to on the Amazon SES SMTP endpoint.
		int PORT = 587;

		// Get the session object
		Properties props = System.getProperties();
		props.put("mail.transport.protocol", "smtp");
		props.put("mail.smtp.port", PORT);
	    props.put("mail.smtp.host", HOST);
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.auth", "true");

		Session session = Session.getInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(SMTP_USERNAME, SMTP_PASSWORD);
			}
		});

		final String SUBJECT = "Ihr angefordertes Passwort";



		// Create a default MimeMessage object.
		Message message = new MimeMessage(session);

		// Set From: header field of the header.
		message.setFrom(new InternetAddress(FROM,FROMNAME));

		// Set To: header field of the header.
		message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(TO));

		// Set Subject: header field
		message.setSubject(SUBJECT);

		MimeMultipart multipart = new MimeMultipart("related");

		BodyPart messageBodyPart = new MimeBodyPart();
		String htmlText = "<img style='width:310px;height:140px;' src=\"cid:image\"><hr></hr><p></p><p></p><p></p><h1>Ihr angefordertes Passwort lautet: </h1><p></p><p></p><div style='background:	#E8E8E8;padding:10px'><h3>" + pw + "</h3><div>";
		messageBodyPart.setContent(htmlText, "text/html");
		// add it
		multipart.addBodyPart(messageBodyPart);

		// second part (the image)
		messageBodyPart = new MimeBodyPart();

		DataSource ds = new FileDataSource(new File(getClass().getResource("/fch_co_logo.png").toURI()));

		messageBodyPart.setDataHandler(new DataHandler(ds));
		messageBodyPart.setHeader("Content-ID", "<image>");

		// add image to the multipart
		multipart.addBodyPart(messageBodyPart);

		// put everything together
		message.setContent(multipart);
		// Send message
		Transport.send(message);
		
		System.out.println("Succefully send");

	}
}
