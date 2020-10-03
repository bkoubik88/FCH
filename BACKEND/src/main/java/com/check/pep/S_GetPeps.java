package com.check.pep;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.net.URL;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.Random;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import javax.mail.MessagingException;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.check.database.Datenbankverbindung;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.Font;
import com.itextpdf.text.Font.FontFamily;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.draw.DottedLineSeparator;

@RestController
@MultipartConfig(maxFileSize = 1024 * 1024 * 500, maxRequestSize = 1024 * 1024 * 600)
public class S_GetPeps {

	private PreparedStatement ps = null;
	private ResultSet rs = null;

	private SecretKeySpec secretKeySpec;
	private String geheim;
	private String pwEntschluesselt;
	private String key = "9CE7B06733CC032E6ED5AEDE569FC0C4";

	public static final String AES = "AES";

	@GetMapping("/getAll")
	public void all(HttpServletResponse response) throws SQLException, IOException {
		Connection con = Verbindung();

		JSONArray nichtbekannt = new JSONArray();

		response.setContentType("application/json");
		JSONArray array = new JSONArray();

		if (con != null) {

			try {
				con.setAutoCommit(false);
				ps = con.prepareStatement("CALL getAll();");
				rs = ps.executeQuery();
				con.commit();

				ResultSetMetaData meta = rs.getMetaData();

				int intRS = meta.getColumnCount();

				while (rs.next()) {

					for (int i = 1; i < intRS + 1; i++) {

						String column_name = meta.getColumnName(i);

						if (rs.getNString("first_Name").equals("") && rs.getString("last_Name").equals("")
								&& rs.getString("dob").equals("")) {
							JSONObject nichtJSON = new JSONObject();

							switch (meta.getColumnType(i)) {

							case java.sql.Types.ARRAY:

								nichtJSON.put(column_name, rs.getArray(column_name));

								break;

							case java.sql.Types.BIGINT:

								nichtJSON.put(column_name, rs.getInt(column_name));

								break;

							case java.sql.Types.BOOLEAN:

								nichtJSON.put(column_name, rs.getBoolean(column_name));

								break;

							case java.sql.Types.BLOB:

								nichtJSON.put(column_name, rs.getBlob(column_name));

								break;

							case java.sql.Types.DOUBLE:

								nichtJSON.put(column_name, rs.getDouble(column_name));

								break;

							case java.sql.Types.FLOAT:

								nichtJSON.put(column_name, rs.getFloat(column_name));

								break;

							case java.sql.Types.INTEGER:

								nichtJSON.put(column_name, rs.getInt(column_name));

								break;

							case java.sql.Types.NVARCHAR:

								nichtJSON.put(column_name, rs.getNString(column_name));

								break;

							case java.sql.Types.VARCHAR:

								nichtJSON.put(column_name, rs.getString(column_name));

								break;

							case java.sql.Types.TINYINT:

								nichtJSON.put(column_name, rs.getInt(column_name));

								break;

							case java.sql.Types.SMALLINT:

								nichtJSON.put(column_name, rs.getInt(column_name));

								break;

							case java.sql.Types.DATE:

								nichtJSON.put(column_name, rs.getDate(column_name));

								break;

							case java.sql.Types.TIMESTAMP:

								nichtJSON.put(column_name, rs.getTimestamp(column_name));

								break;

							default:

								nichtJSON.put(column_name, rs.getObject(column_name));

								break;

							}

							nichtbekannt.put(nichtJSON);

						}

						else {

							JSONObject obj = new JSONObject();

							switch (meta.getColumnType(i)) {

							case java.sql.Types.ARRAY:

								obj.put(column_name, rs.getArray(column_name));

								break;

							case java.sql.Types.BIGINT:

								obj.put(column_name, rs.getInt(column_name));

								break;

							case java.sql.Types.BOOLEAN:

								obj.put(column_name, rs.getBoolean(column_name));

								break;

							case java.sql.Types.BLOB:

								obj.put(column_name, rs.getBlob(column_name));

								break;

							case java.sql.Types.DOUBLE:

								obj.put(column_name, rs.getDouble(column_name));

								break;

							case java.sql.Types.FLOAT:

								obj.put(column_name, rs.getFloat(column_name));

								break;

							case java.sql.Types.INTEGER:

								obj.put(column_name, rs.getInt(column_name));

								break;

							case java.sql.Types.NVARCHAR:

								obj.put(column_name, rs.getNString(column_name));

								break;

							case java.sql.Types.VARCHAR:

								obj.put(column_name, rs.getString(column_name));

								break;

							case java.sql.Types.TINYINT:

								obj.put(column_name, rs.getInt(column_name));

								break;

							case java.sql.Types.SMALLINT:

								obj.put(column_name, rs.getInt(column_name));

								break;

							case java.sql.Types.DATE:

								obj.put(column_name, rs.getDate(column_name));

								break;

							case java.sql.Types.TIMESTAMP:

								obj.put(column_name, rs.getTimestamp(column_name));

								break;

							default:

								obj.put(column_name, rs.getObject(column_name));

								break;

							}

							array.put(obj);

						}

					}

				}
			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rs != null) {
					rs.close();
				}
				if (ps != null) {
					ps.close();
				}
				if (con != null) {
					con.close();
				}
			}
		}

		System.out.println("Unbekannt: " + nichtbekannt.toString());

		PrintWriter out = response.getWriter();
		out.print(array);
		out.flush();
		out.close();

	}

	@PostMapping("/PasswortAendern")
	@CrossOrigin
	public void PasswortAendern(HttpServletResponse response, HttpServletRequest request)
			throws SQLException, IOException {

		String email = request.getParameter("email");
		String passwort = request.getParameter("passwort");
		String kundenId = request.getParameter("kundenId");

		Connection con = Verbindung();
		if (!email.trim().equals("")) {
			try {

				con.setAutoCommit(false);
				ps = con.prepareStatement("CALL passwortAendern(?,?,?);");
				ps.setString(1, kundenId);
				ps.setString(2, email);
				ps.setString(3, passwort);
				ps.executeUpdate();
				con.commit();

			} finally {
				con.close();
				ps.close();
				rs.close();
			}
		}

		response.setContentType("text/html");
		PrintWriter out = response.getWriter();
		out.write("Passwort wurde geändert");
		out.flush();
		out.close();

	}

	@GetMapping("/PasswortAnfordern")
	@CrossOrigin
	public void PasswortAnfordern(@RequestParam(required = true) String email, HttpServletResponse response)
			throws SQLException, IOException {

		Connection con = Verbindung();
		if (!email.trim().equals("")) {
			try {

				con.setAutoCommit(false);
				ps = con.prepareStatement("CALL getOneUser(?);");
				ps.setString(1, email);
				rs = ps.executeQuery();
				con.commit();

				String pw = "";
				while (rs.next()) {
					pw = rs.getString("passwort");
				}

				SendEmail sm = new SendEmail();
				try {
					sm.sendMailTo(email, pw);
				} catch (URISyntaxException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

			} catch (UnsupportedEncodingException | MessagingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} finally {
				con.close();
				ps.close();
				rs.close();
			}
		}

		response.setContentType("text/html");
		PrintWriter out = response.getWriter();
		out.write("Eine Email mit Ihrem Passwort wurde Ihnen zugesandt");
		out.flush();
		out.close();

	}

	// JUST FOR PORTFOLIO

	@PostMapping("/GemerkteNamenVersenden")
	@CrossOrigin
	public void GemerkteNamenVersenden(HttpServletResponse response, HttpServletRequest request)
			throws SQLException, IOException {

		String pdfs = request.getParameter("pdfid_");
		String firmenId = request.getParameter("firmenId");
		String kundeId = request.getParameter("kundeId");
		String anKundeEmail_ = request.getParameter("anKundeEmail_");
		String vornameVon = request.getParameter("vornameVon");
		String nachnameVom = request.getParameter("nachnameVon");

		try {

			String[] split = pdfs.split(",");

			Connection con = Verbindung();
			con.setAutoCommit(false);

			for (String s : split) {
				ps = con.prepareStatement("CALL pdfVersenden(?,?,?,?,?,?);");
				ps.setString(1, kundeId);
				ps.setString(2, firmenId);
				ps.setString(3, s);
				ps.setString(4, anKundeEmail_);
				ps.setString(5, vornameVon);
				ps.setString(6, nachnameVom);
				ps.executeUpdate();
			}

			con.commit();

			if (anKundeEmail_.trim().length() > 2) {
				try {

					SendEmailGemerkte sm = new SendEmailGemerkte();
					try {
						sm.sendMailTo(anKundeEmail_.toString());
					} catch (URISyntaxException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}

				} catch (UnsupportedEncodingException | MessagingException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} finally {

				}
			}

		} catch (JSONException e) {
			throw new IOException("Error parsing JSON request string");
		}

		response.setContentType("text/html");
		PrintWriter out = response.getWriter();
		out.write("Email wurde versandt");
		out.flush();
		out.close();

	}

	@GetMapping("/PDF_Rechnung")
	@CrossOrigin
	public void PDF_Rechnung(HttpServletResponse response, HttpServletRequest request)
			throws SQLException, ParseException {

		response.setHeader("Access-Control-Allow-Origin", "*");

		Connection con = Verbindung();

		String firmen_id = request.getParameter("firmen_id");
		String berechnungsschluessel = request.getParameter("berechnungsschluessel");
		String von = request.getParameter("von");
		String bis = request.getParameter("bis");

		SimpleDateFormat df = new SimpleDateFormat("dd.MM.yyyy");
		Date d1 = null;
		Date d2 = null;
		java.sql.Date sqlDateVon = null;
		java.sql.Date sqlDateBis = null;

		try {
			d1 = df.parse(von);
			d2 = df.parse(bis);

			sqlDateVon = new java.sql.Date(d1.getTime());
			sqlDateBis = new java.sql.Date(d2.getTime());

		} catch (ParseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		berechnungsschluessel = berechnungsschluessel.replaceAll(",", ".").trim();

		if (firmen_id != "") {

			con.setAutoCommit(false);

			ps = con.prepareStatement("CALL pdfRechungFirma(?,?,?);");
			ps.setString(1, firmen_id);
			ps.setString(2, sqlDateVon.toString());
			ps.setString(3, sqlDateBis.toString());
			rs = ps.executeQuery();

			con.commit();

			int gesamt = 0;

			try {

				Font fntSize = new Font(FontFamily.HELVETICA, 15, Font.UNDERLINE);
				Font fntSizeZeitraum = new Font(FontFamily.HELVETICA, 13, Font.BOLD);
				Font fntSizeAbfragen = new Font(FontFamily.HELVETICA, 12, Font.NORMAL);
				Font fntSizeBetrag = new Font(FontFamily.HELVETICA, 12, Font.BOLD);

				// step 1
				Document document = new Document(PageSize.A4);
				// step 2
				ByteArrayOutputStream baos = new ByteArrayOutputStream();
				PdfWriter.getInstance(document, baos);
				// step 3
				document.open();

				CustomDashedLineSeparator separator = new CustomDashedLineSeparator();
				separator.setDash(5);
				separator.setGap(5);
				separator.setLineWidth(4);
				Chunk linebreak = new Chunk(separator);

				Chunk linebreakListe = new Chunk(new DottedLineSeparator());

				URL imageUrl = getClass().getResource("/fch_co_logo.png");
				Image logo = Image.getInstance(imageUrl);
				logo.scaleToFit(140, 140);

				logo.setAlignment(Image.ALIGN_RIGHT);

				// step 4

				document.add(logo);

				document.add(new Paragraph("\n"));
				document.add(linebreak);
				document.add(new Paragraph("\n\n"));

				document.add(new Paragraph(new Phrase("Kostenaufstellung (" + firmen_id + ")", fntSize)));
				document.add(new Paragraph("\n\n\n"));
				document.add(new Paragraph(new Phrase("Zeitraum: " + von + " - " + bis, fntSizeZeitraum)));
				document.add(new Paragraph("\n\n\n"));
				document.add(new Paragraph(new Phrase("Übersicht", fntSizeAbfragen)));
				document.add(new Paragraph("\n"));

				while (rs.next()) {
					gesamt++;
					System.out.println("Nachname: " + rs.getString("nachname"));
					document.add(new Paragraph(rs.getString("nachname") + ", " + rs.getString("vorname") + " ("
							+ rs.getString("email") + "):"));
					document.add(new Paragraph("Suchte nach: " + rs.getString("suchteNach") + "; am: "
							+ new SimpleDateFormat("dd.MM.yyyy").format(rs.getDate("datum"))));
					document.add(linebreakListe);
				}

				document.add(Chunk.NEWLINE);

				document.add(new Paragraph("Gesamt: " + gesamt));
				document.add(Chunk.NEWLINE);
				document.add(new Paragraph("Berechnungsschlüssel : " + berechnungsschluessel + " € pro Abfrage"));
				document.add(new Paragraph(gesamt + " Abfragen x " + berechnungsschluessel + " €"));
				document.add(
						new Paragraph(new Phrase(
								"Gesamt Betrag: " + new DecimalFormat("###0.00")
										.format(gesamt * Double.parseDouble(berechnungsschluessel)) + " €",
								fntSizeBetrag)));
				document.add(Chunk.NEWLINE);
				document.add(Chunk.NEWLINE);
				document.add(Chunk.NEWLINE);
				
				// step 5
				document.close();

				// setting some response headers
				response.setHeader("Expires", "0");
				response.setHeader("Cache-Control", "must-revalidate, post-check=0, pre-check=0");
				response.setHeader("Pragma", "public");
				response.setHeader("Content-Disposition", "attachment; filename=\"" + firmen_id + "_"
						+ new SimpleDateFormat("dd_MM_yyy_HH_mm_ss").format(new Date()) + ".pdf" + "\"");
				// setting the content type
				response.setContentType("application/pdf");
				// the contentlength
				response.setContentLength(baos.size());
				// write ByteArrayOutputStream to the ServletOutputStream
				OutputStream os = response.getOutputStream();
				baos.writeTo(os);

				os.flush();
				os.close();

			} catch (Exception e) {
				e.printStackTrace();
			}

		}

	}

	@PostMapping("/Verlauf")
	@CrossOrigin
	public void Verlauf(HttpServletRequest request, HttpServletResponse response) throws SQLException {

		response.setHeader("Access-Control-Allow-Origin", "*");

		String kundeId = request.getParameter("kundeId");
		String firmenId = request.getParameter("firmenId");
		String vorname = request.getParameter("vorname");
		String nachname = request.getParameter("nachname");
		String suchteNach = request.getParameter("suchteNach");
		String tatWas = request.getParameter("tatWas");

		Connection con = Verbindung();

		PreparedStatement ps1 = con.prepareStatement("CALL saveVerlauf(?,?,?,?,?,?);");
		con.setAutoCommit(false);
		ps1.setString(1, kundeId);
		ps1.setString(2, vorname);
		ps1.setString(3, nachname);
		ps1.setString(4, suchteNach);
		ps1.setString(5, tatWas);
		ps1.setString(6, firmenId);
		ps1.executeUpdate();

		con.commit();
		ps1.close();
	}

	@PostMapping("/changeListeAndSearch")
	@CrossOrigin
	public void changeListeAndSearch(HttpServletRequest request, HttpServletResponse response) throws SQLException {

		response.setHeader("Access-Control-Allow-Origin", "*");

		String liste = request.getParameter("liste");
		String firmendId = request.getParameter("firmendId");
		String suche = request.getParameter("suche");

		if (suche.equals(true) || suche.equals("1")) {
			suche = "1";
		} else {
			suche = "0";
		}
		Connection con = Verbindung();

		PreparedStatement ps1 = con.prepareStatement("CALL updateListeundSuche(?,?,?);");
		con.setAutoCommit(false);
		ps1.setString(1, liste);
		ps1.setString(2, firmendId);
		ps1.setString(3, suche);
		int anzahl = ps1.executeUpdate();
		System.out.println("Geändert: " + anzahl);
		con.commit();
		ps1.close();
	}

	@PostMapping("/saveAbfragenFuerGemerkte")
	@CrossOrigin
	public void saveAbfragenFuerGemerkte(String gesuchtNach, String firmenId, String pdfId, String kundenId,
			HttpServletResponse response) throws SQLException {

		Connection con = Verbindung();

		PreparedStatement ps1 = con.prepareStatement("CALL saveAbfrageFürGemerkte(?,?,?,?);");
		con.setAutoCommit(false);
		ps1.setString(1, pdfId);
		ps1.setString(2, kundenId);
		ps1.setString(3, firmenId);
		ps1.setString(4, gesuchtNach);
		ps1.executeUpdate();
		con.commit();
		ps1.close();
	}
	
	
	
	

	@GetMapping("/saveAbfragen")
	@CrossOrigin
	public void saveAbfragen(String gesuchtNach, String firmenId, String kundenId, String liste,
			HttpServletResponse response) throws SQLException {

		Connection con = Verbindung();

		PreparedStatement ps1 = con.prepareStatement("CALL saveAbfrage(?,?,?,?);");
		con.setAutoCommit(false);
		ps1.setString(1, kundenId);
		ps1.setString(2, firmenId);
		ps1.setString(3, gesuchtNach);
		ps1.setString(4, liste);
		ps1.executeUpdate();
		con.commit();
		ps1.close();
		
		con.close();
	}

	
	
	
	
	
	// Get the PDF
	@GetMapping("/keinTreffer")
	@CrossOrigin
	public void PDF(String gesuchtNach, String firmenId, String kundenId, HttpServletResponse response) {

		try {

			float fntSize = 13.0f;

			// step 1
			Document document = new Document(PageSize.A4);
			// step 2
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			PdfWriter.getInstance(document, baos);
			// step 3
			document.open();

			CustomDashedLineSeparator separator = new CustomDashedLineSeparator();
			separator.setDash(3);
			separator.setGap(2);
			separator.setLineWidth(4);
			Chunk linebreak = new Chunk(separator);

			URL imageUrl = getClass().getResource("/fch_co_logo.png");
			Image logo = Image.getInstance(imageUrl);
			logo.scaleToFit(140, 140);

			logo.setAlignment(Image.ALIGN_RIGHT);

			// step 4

			document.add(logo);

			document.add(new Paragraph("\n"));
			document.add(linebreak);
			document.add(new Paragraph("\n\n"));

			document.add(new Paragraph(
					new Phrase("Abfrage vom " + new SimpleDateFormat("dd.MM.yyyy HH:mm:ss").format(new Date()))));
			document.add(new Paragraph(new Phrase("Gesucht nach:")));
			document.add(new Paragraph(new Phrase(gesuchtNach)));
			document.add(Chunk.NEWLINE);
			document.add(new Paragraph(new Phrase(linebreak)));
			document.add(Chunk.NEWLINE);

			document.add(new Paragraph(
					new Phrase("Ihre Suche ergab kein Treffer", FontFactory.getFont(FontFactory.HELVETICA, fntSize))));

			// step 5
			document.close();

			// setting some response headers
			response.setHeader("Expires", "0");

			response.setHeader("Cache-Control", "must-revalidate, post-check=0, pre-check=0");
			response.setHeader("Pragma", "public");
			response.setHeader("Content-Disposition", "attachment; filename=keinTreffer_"
					+ new SimpleDateFormat("dd_MM_yyy_HH_mm_ss").format(new Date()) + ".pdf" + "\"");
			// setting the content type
			response.setContentType("application/pdf");
			// the contentlength
			response.setContentLength(baos.size());
			// write ByteArrayOutputStream to the ServletOutputStream

			OutputStream os = response.getOutputStream();
			baos.writeTo(os);

			os.flush();
			os.close();

		} catch (Exception e) {
			e.printStackTrace();

		} finally {

		}

	}

	// Get the PDF
	@GetMapping("/getPdf")
	@CrossOrigin
	public void PDF(@RequestParam(required = true) String _id, String gesuchtNach, String firmenId, String kundenId,
			String liste, HttpServletResponse response) {

		Connection con = Verbindung();
		ResultSet rsPdf = null;
		PreparedStatement psPdf = null;
		if (!_id.equals("")) {

			try {

				
				
				
				con.setAutoCommit(false);

				psPdf = con.prepareStatement("CALL getOne(?,?);");
				psPdf.setString(1, _id);
				psPdf.setString(2, liste);

				rsPdf = psPdf.executeQuery();

				con.commit();

				while (rsPdf.next()) {
					float fntSize = 8.0f;

					// step 1
					Document document = new Document(PageSize.A4);
					// step 2
					ByteArrayOutputStream baos = new ByteArrayOutputStream();
					PdfWriter.getInstance(document, baos);
					// step 3
					document.open();

					CustomDashedLineSeparator separator = new CustomDashedLineSeparator();
					separator.setDash(3);
					separator.setGap(2);
					separator.setLineWidth(4);
					Chunk linebreak = new Chunk(separator);

					URL imageUrl = getClass().getResource("/fch_co_logo.png");
					Image logo = Image.getInstance(imageUrl);
					logo.scaleToFit(140, 140);

					logo.setAlignment(Image.ALIGN_RIGHT);

					// step 4

					document.add(logo);

					document.add(new Paragraph("\n"));
					document.add(linebreak);
					document.add(new Paragraph("\n\n"));

					document.add(new Paragraph(new Phrase(
							"Abfrage vom " + new SimpleDateFormat("dd.MM.yyyy HH:mm:ss").format(new Date()))));
					document.add(new Paragraph(new Phrase("Gesucht nach:")));
					document.add(new Paragraph(new Phrase(gesuchtNach)));
					document.add(Chunk.NEWLINE);
					document.add(new Paragraph(new Phrase(linebreak)));
					document.add(Chunk.NEWLINE);

					document.add(
							new Paragraph(new Phrase("Title", FontFactory.getFont(FontFactory.HELVETICA, fntSize))));

					document.add(new Paragraph(rsPdf.getString("title")));
					document.add(Chunk.NEWLINE);
					document.add(new Paragraph(
							new Phrase("First Name", FontFactory.getFont(FontFactory.HELVETICA, fntSize))));
					document.add(new Paragraph(rsPdf.getString("first_Name")));
					document.add(Chunk.NEWLINE);
					document.add(new Paragraph(
							new Phrase("Last Name", FontFactory.getFont(FontFactory.HELVETICA, fntSize))));
					document.add(new Paragraph(rsPdf.getString("last_Name")));
					document.add(Chunk.NEWLINE);
					document.add(new Paragraph(
							new Phrase("Day Of Birth", FontFactory.getFont(FontFactory.HELVETICA, fntSize))));
					document.add(new Paragraph(rsPdf.getString("dob")));
					document.add(Chunk.NEWLINE);
					document.add(new Paragraph(
							new Phrase("Place Of Birth", FontFactory.getFont(FontFactory.HELVETICA, fntSize))));
					document.add(new Paragraph(rsPdf.getString("pob")));
					document.add(Chunk.NEWLINE);
					document.add(new Paragraph(
							new Phrase("Full Name", FontFactory.getFont(FontFactory.HELVETICA, fntSize))));
					document.add(new Paragraph(rsPdf.getString("full_Name")));
					document.add(Chunk.NEWLINE);
					document.add(new Paragraph(
							new Phrase("Other Names", FontFactory.getFont(FontFactory.HELVETICA, fntSize))));
					document.add(new Paragraph(rsPdf.getString("other_Names")));
					document.add(Chunk.NEWLINE);
					document.add(
							new Paragraph(new Phrase("Function", FontFactory.getFont(FontFactory.HELVETICA, fntSize))));
					document.add(new Paragraph(rsPdf.getString("function")));
					document.add(Chunk.NEWLINE);
					document.add(new Paragraph(
							new Phrase("Categorie", FontFactory.getFont(FontFactory.HELVETICA, fntSize))));
					document.add(new Paragraph(rsPdf.getString("category")));
					document.add(Chunk.NEWLINE);

//						if (liste.equals("nurPep")) {
//
//							document.add(new Paragraph(
//									new Phrase("Function", FontFactory.getFont(FontFactory.HELVETICA, fntSize))));
//							document.add(new Paragraph(rsPdf.getString("function")));
//							document.add(Chunk.NEWLINE);
//							document.add(new Paragraph(
//									new Phrase("Categorie", FontFactory.getFont(FontFactory.HELVETICA, fntSize))));
//							document.add(new Paragraph(rsPdf.getString("category")));
//							document.add(Chunk.NEWLINE);
//							document.add(new Paragraph(
//									new Phrase("Country", FontFactory.getFont(FontFactory.HELVETICA, fntSize))));
//							document.add(new Paragraph(rsPdf.getString("name_of_the_List")));
//							document.add(Chunk.NEWLINE);
//							
//
//						}

					if (liste.equals("nurSanktion")) {

						document.add(new Paragraph(
								new Phrase("Name of the List", FontFactory.getFont(FontFactory.HELVETICA, fntSize))));
						document.add(new Paragraph(rsPdf.getString("name_of_the_List")));
						document.add(Chunk.NEWLINE);
						document.add(new Paragraph(
								new Phrase("Authority", FontFactory.getFont(FontFactory.HELVETICA, fntSize))));
						document.add(new Paragraph(rsPdf.getString("Authority")));
						document.add(Chunk.NEWLINE);
						document.add(new Paragraph(
								new Phrase("Address", FontFactory.getFont(FontFactory.HELVETICA, fntSize))));
						document.add(new Paragraph(rsPdf.getString("address")));
						document.add(Chunk.NEWLINE);
						document.add(new Paragraph(
								new Phrase("Type SDN Or Entity", FontFactory.getFont(FontFactory.HELVETICA, fntSize))));
						document.add(new Paragraph(rsPdf.getString("type_SDN_or_Entity")));
						document.add(Chunk.NEWLINE);

					}

					document.add(new Paragraph(
							new Phrase("Additional Information", FontFactory.getFont(FontFactory.HELVETICA, fntSize))));
					document.add(new Paragraph(rsPdf.getString("additional_Information")));
					document.add(Chunk.NEWLINE);

					if (liste.equals("nurSanktion") || liste.equals("")) {
						document.add(new Paragraph(
								new Phrase("Name of the List", FontFactory.getFont(FontFactory.HELVETICA, fntSize))));
						document.add(new Paragraph(rsPdf.getString("Name_of_the_List")));
						document.add(Chunk.NEWLINE);
						document.add(new Paragraph(
								new Phrase("Authority", FontFactory.getFont(FontFactory.HELVETICA, fntSize))));
						document.add(new Paragraph(rsPdf.getString("authority")));
						document.add(Chunk.NEWLINE);
						document.add(new Paragraph(
								new Phrase("Address", FontFactory.getFont(FontFactory.HELVETICA, fntSize))));
						document.add(new Paragraph(rsPdf.getString("address")));
						document.add(Chunk.NEWLINE);
						document.add(new Paragraph(
								new Phrase("Type SDN or Entity", FontFactory.getFont(FontFactory.HELVETICA, fntSize))));
						document.add(new Paragraph(rsPdf.getString("Type_SDN_or_Entity")));
					}
					// step 5
					document.close();

					// setting some response headers
					response.setHeader("Expires", "0");

					response.setHeader("Cache-Control", "must-revalidate, post-check=0, pre-check=0");
					response.setHeader("Pragma", "public");
					response.setHeader("Content-Disposition", "attachment; filename=\"" + _id + "_"
							+ new SimpleDateFormat("dd_MM_yyy_HH_mm_ss").format(new Date()) + ".pdf" + "\"");
					// setting the content type
					response.setContentType("application/pdf");
					// the contentlength
					response.setContentLength(baos.size());
					// write ByteArrayOutputStream to the ServletOutputStream

					OutputStream os = response.getOutputStream();
					baos.writeTo(os);

					os.flush();
					os.close();

				}

			} catch (Exception e) {
				e.printStackTrace();

			} finally {
				if (rsPdf != null) {
					try {
						rsPdf.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (psPdf != null) {
					try {
						psPdf.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}

		}
	}

	public String randomPassword() {
		int leftLimit = 97; // letter 'a'
		int rightLimit = 122; // letter 'z'
		int targetStringLength = 10;
		Random random = new Random();

		String generatedString = random.ints(leftLimit, rightLimit + 1).limit(targetStringLength)
				.collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append).toString();

		System.out.println(generatedString);

		return generatedString;
	}

	@PostMapping("/userNeuanlage")
	@CrossOrigin
	public void userNeuanlage(HttpServletRequest request, HttpServletResponse response) throws IOException {

		Connection con = Verbindung();

		String Anrede = request.getParameter("Anrede");
		String Vorname = request.getParameter("Vorname");
		String Nachname = request.getParameter("Nachname");

		String Email = request.getParameter("Email");

		String FirmenID = request.getParameter("FirmenID");
		String Rolle = request.getParameter("Rolle");

		if (con != null) {

			try {

				con.setAutoCommit(false);
				ps = con.prepareStatement("CALL userNeu(?,?,?,?,?,?);");
				ps.setString(1, FirmenID);
				ps.setString(2, Anrede);
				ps.setString(3, Vorname);
				ps.setString(4, Nachname);
				ps.setString(5, Email);
				ps.setString(6, Rolle);

				ps.executeUpdate();
				con.commit();

			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rs != null) {
					try {
						rs.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (ps != null) {
					try {
						ps.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}

	}

	@GetMapping("/kundenEinerFima")
	@CrossOrigin
	public void kundenEinerFima(@RequestParam(required = true) String firmenId, HttpServletResponse response)
			throws IOException {

		response.setContentType("application/json");

		Connection con = Verbindung();

		JSONArray array = new JSONArray();
		PreparedStatement ps1 = null;
		ResultSet rs1 = null;

		if (con != null) {

			try {

				con.setAutoCommit(false);
				ps1 = con.prepareStatement("CALL getAllKundenFromOneFirma(?);");
				ps1.setString(1, firmenId);
				ps1.execute();
				rs1 = ps1.getResultSet();
				con.commit();

				ResultSetMetaData meta = rs1.getMetaData();

				int intRS = meta.getColumnCount();

				while (rs1.next()) {
					JSONObject obj = new JSONObject();

					for (int i = 1; i < intRS + 1; i++) {

						String column_name = meta.getColumnName(i);

						switch (meta.getColumnType(i)) {

						case java.sql.Types.ARRAY:

							obj.put(column_name, rs1.getArray(column_name));

							break;

						case java.sql.Types.BIGINT:

							obj.put(column_name, rs1.getInt(column_name));

							break;

						case java.sql.Types.BOOLEAN:

							obj.put(column_name, rs1.getBoolean(column_name));

							break;

						case java.sql.Types.BLOB:

							obj.put(column_name, rs1.getBlob(column_name));

							break;

						case java.sql.Types.DOUBLE:

							obj.put(column_name, rs1.getDouble(column_name));

							break;

						case java.sql.Types.FLOAT:

							obj.put(column_name, rs1.getFloat(column_name));

							break;

						case java.sql.Types.INTEGER:

							obj.put(column_name, rs1.getInt(column_name));

							break;

						case java.sql.Types.NVARCHAR:

							obj.put(column_name, rs1.getNString(column_name));

							break;

						case java.sql.Types.VARCHAR:

							obj.put(column_name, rs1.getString(column_name));

							break;

						case java.sql.Types.TINYINT:

							obj.put(column_name, rs1.getInt(column_name));

							break;

						case java.sql.Types.SMALLINT:

							obj.put(column_name, rs1.getInt(column_name));

							break;

						case java.sql.Types.DATE:

							obj.put(column_name, new SimpleDateFormat("dd.MM.yyyy").format(rs1.getDate(column_name)));

							break;

						case java.sql.Types.TIMESTAMP:

							obj.put(column_name, rs1.getTimestamp(column_name));

							break;

						default:

							obj.put(column_name, rs1.getObject(column_name));

							break;

						}

					}

					array.put(obj);
				}

			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rs1 != null) {
					try {
						rs1.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (ps1 != null) {
					try {
						ps1.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}

		PrintWriter out = response.getWriter();
		out.print(array);
		out.flush();
		out.close();
	}

	@GetMapping("/neuerKundeZuFirmaHinzufuegen")
	@CrossOrigin
	public void neuerKundeZuFirmaHinzufuegen(@RequestParam(required = true) String firmenId, String anrede,
			String vorname, String nachname, String email, HttpServletResponse response) throws IOException {

		response.setContentType("application/json");

		Connection con = Verbindung();

		JSONArray array = new JSONArray();

		String StandardPasswort = null;

		StandardPasswort = PasswordGenerator.generatePassword(8, PasswordGenerator.CharacterSet.All);

		if (con != null) {

			try {
				con.setAutoCommit(false);
				ps = con.prepareStatement("CALL neuerKundeZuFirmaHinzufuegen(?,?,?,?,?,?);");
				ps.setString(1, firmenId);
				ps.setString(2, vorname);
				ps.setString(3, nachname);
				ps.setString(4, anrede);
				ps.setString(5, email);
				ps.setString(6, StandardPasswort);
				ps.executeUpdate();

				ps = con.prepareStatement("CALL getAllKundenFromOneFirma(?);");
				ps.setString(1, firmenId);
				rs = ps.executeQuery();
				con.commit();

				ResultSetMetaData meta = rs.getMetaData();

				int intRS = meta.getColumnCount();

				while (rs.next()) {
					JSONObject obj = new JSONObject();

					for (int i = 1; i < intRS + 1; i++) {

						String column_name = meta.getColumnName(i);

						switch (meta.getColumnType(i)) {

						case java.sql.Types.ARRAY:

							obj.put(column_name, rs.getArray(column_name));

							break;

						case java.sql.Types.BIGINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.BOOLEAN:

							obj.put(column_name, rs.getBoolean(column_name));

							break;

						case java.sql.Types.BLOB:

							obj.put(column_name, rs.getBlob(column_name));

							break;

						case java.sql.Types.DOUBLE:

							obj.put(column_name, rs.getDouble(column_name));

							break;

						case java.sql.Types.FLOAT:

							obj.put(column_name, rs.getFloat(column_name));

							break;

						case java.sql.Types.INTEGER:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.NVARCHAR:

							obj.put(column_name, rs.getNString(column_name));

							break;

						case java.sql.Types.VARCHAR:

							obj.put(column_name, rs.getString(column_name));

							break;

						case java.sql.Types.TINYINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.SMALLINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.DATE:

							obj.put(column_name, new SimpleDateFormat("dd.MM.yyyy").format(rs.getDate(column_name)));

							break;

						case java.sql.Types.TIMESTAMP:

							obj.put(column_name, rs.getTimestamp(column_name));

							break;

						default:

							obj.put(column_name, rs.getObject(column_name));

							break;

						}

					}

					array.put(obj);
				}

			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rs != null) {
					try {
						rs.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (ps != null) {
					try {
						ps.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}

		PrintWriter out = response.getWriter();
		out.print(array);
		out.flush();
		out.close();
	}

	@PostMapping("/verschicktePdfAbfragen")
	@CrossOrigin
	public void verschicktePdfAbfragen(@RequestParam(required = true) String email, HttpServletResponse response)
			throws IOException {

		response.setContentType("application/json");

		Connection con = Verbindung();

		JSONArray array = new JSONArray();

		if (con != null) {

			try {
				con.setAutoCommit(false);
				ps = con.prepareStatement("CALL pdfAbfrageVonGeschickten(?);");
				ps.setString(1, email);
				rs = ps.executeQuery();

				con.commit();

				ResultSetMetaData meta = rs.getMetaData();

				int intRS = meta.getColumnCount();

				while (rs.next()) {
					JSONObject obj = new JSONObject();

					for (int i = 1; i < intRS + 1; i++) {

						String column_name = meta.getColumnName(i);

						switch (meta.getColumnType(i)) {

						case java.sql.Types.ARRAY:

							obj.put(column_name, rs.getArray(column_name));

							break;

						case java.sql.Types.BIGINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.BOOLEAN:

							obj.put(column_name, rs.getBoolean(column_name));

							break;

						case java.sql.Types.BLOB:

							obj.put(column_name, rs.getBlob(column_name));

							break;

						case java.sql.Types.DOUBLE:

							obj.put(column_name, rs.getDouble(column_name));

							break;

						case java.sql.Types.FLOAT:

							obj.put(column_name, rs.getFloat(column_name));

							break;

						case java.sql.Types.INTEGER:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.NVARCHAR:

							obj.put(column_name, rs.getNString(column_name));

							break;

						case java.sql.Types.VARCHAR:

							obj.put(column_name, rs.getString(column_name));

							break;

						case java.sql.Types.TINYINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.SMALLINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.DATE:

							obj.put(column_name, new SimpleDateFormat("dd.MM.yyyy").format(rs.getDate(column_name)));

							break;

						case java.sql.Types.TIMESTAMP:

							obj.put(column_name, rs.getTimestamp(column_name));

							break;

						default:

							obj.put(column_name, rs.getObject(column_name));

							break;

						}

					}

					array.put(obj);
				}

			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rs != null) {
					try {
						rs.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (ps != null) {
					try {
						ps.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}

		PrintWriter out = response.getWriter();
		out.print(array);
		out.flush();
		out.close();
	}

	@GetMapping("/firmaUndKundenEntfernen")
	@CrossOrigin
	public void firmaUndKundenEntfernen(@RequestParam(required = true) String firmenID, HttpServletResponse response)
			throws IOException {

		response.setContentType("text/html");

		Connection con = Verbindung();

		if (con != null) {

			try {
				con.setAutoCommit(false);
				ps = con.prepareStatement("CALL firmaUndKundenEntfernen(?);");
				ps.setString(1, firmenID);
				ps.executeUpdate();
				con.commit();

			} catch (SQLIntegrityConstraintViolationException e) {
				e.printStackTrace();

			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rs != null) {
					try {
						rs.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (ps != null) {
					try {
						ps.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}

	}

	@PostMapping("/singleFirma")
	@CrossOrigin
	public void singleFirma(HttpServletResponse response, HttpServletRequest request) throws IOException {

		String firmenId = request.getParameter("firmen_id");

		response.setContentType("application/json");

		Connection con = Verbindung();

		JSONArray array = new JSONArray();

		PrintWriter out = response.getWriter();

		if (con != null) {

			try {

				con.setAutoCommit(false);
				ps = con.prepareStatement("CALL getSingleFirma(?);");
				ps.setString(1, firmenId);
				rs = ps.executeQuery();
				con.commit();

				ResultSetMetaData meta = rs.getMetaData();

				int intRS = meta.getColumnCount();

				while (rs.next()) {
					JSONObject obj = new JSONObject();

					for (int i = 1; i < intRS + 1; i++) {

						String column_name = meta.getColumnName(i);

						switch (meta.getColumnType(i)) {

						case java.sql.Types.ARRAY:

							obj.put(column_name, rs.getArray(column_name));

							break;

						case java.sql.Types.BIGINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.BOOLEAN:

							obj.put(column_name, rs.getBoolean(column_name));

							break;

						case java.sql.Types.BLOB:

							obj.put(column_name, rs.getBlob(column_name));

							break;

						case java.sql.Types.DOUBLE:

							obj.put(column_name, rs.getDouble(column_name));

							break;

						case java.sql.Types.FLOAT:

							obj.put(column_name, rs.getFloat(column_name));

							break;

						case java.sql.Types.INTEGER:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.NVARCHAR:

							obj.put(column_name, rs.getNString(column_name));

							break;

						case java.sql.Types.VARCHAR:

							obj.put(column_name, rs.getString(column_name));

							break;

						case java.sql.Types.TINYINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.SMALLINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.DATE:

							obj.put(column_name, new SimpleDateFormat("dd.MM.yyyy").format(rs.getDate(column_name)));

							break;

						case java.sql.Types.TIMESTAMP:

							obj.put(column_name, rs.getTimestamp(column_name));

							break;

						default:

							obj.put(column_name, rs.getObject(column_name));

							break;

						}

					}

					array.put(obj);
				}

			} catch (SQLIntegrityConstraintViolationException e) {
				JSONObject obj = new JSONObject();
				obj.put("Fehler", "FirmenID/FirmenName bereits vorhanden - keine Duplikate zulässig");
				array.put(obj);

			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rs != null) {
					try {
						rs.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (ps != null) {
					try {
						ps.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}

		out.print(array);
		out.flush();
		out.close();
	}

	@GetMapping("/neueFirma")
	@CrossOrigin
	public void neueFirma(@RequestParam(required = true) String firmenName, String firmenId,
			HttpServletResponse response) throws IOException {

		response.setContentType("application/json");

		Connection con = Verbindung();

		JSONArray array = new JSONArray();

		PrintWriter out = response.getWriter();

		if (con != null) {

			try {
				con.setAutoCommit(false);
				ps = con.prepareStatement("CALL neueFirma(?,?);");
				ps.setString(1, firmenName);
				ps.setString(2, firmenId);

				ps.executeUpdate();

				ps = con.prepareStatement("CALL getSingleFirma(?);");
				ps.setString(1, firmenId);
				rs = ps.executeQuery();
				con.commit();

				ResultSetMetaData meta = rs.getMetaData();

				int intRS = meta.getColumnCount();

				while (rs.next()) {
					JSONObject obj = new JSONObject();

					for (int i = 1; i < intRS + 1; i++) {

						String column_name = meta.getColumnName(i);

						switch (meta.getColumnType(i)) {

						case java.sql.Types.ARRAY:

							obj.put(column_name, rs.getArray(column_name));

							break;

						case java.sql.Types.BIGINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.BOOLEAN:

							obj.put(column_name, rs.getBoolean(column_name));

							break;

						case java.sql.Types.BLOB:

							obj.put(column_name, rs.getBlob(column_name));

							break;

						case java.sql.Types.DOUBLE:

							obj.put(column_name, rs.getDouble(column_name));

							break;

						case java.sql.Types.FLOAT:

							obj.put(column_name, rs.getFloat(column_name));

							break;

						case java.sql.Types.INTEGER:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.NVARCHAR:

							obj.put(column_name, rs.getNString(column_name));

							break;

						case java.sql.Types.VARCHAR:

							obj.put(column_name, rs.getString(column_name));

							break;

						case java.sql.Types.TINYINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.SMALLINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.DATE:

							obj.put(column_name, new SimpleDateFormat("dd.MM.yyyy").format(rs.getDate(column_name)));

							break;

						case java.sql.Types.TIMESTAMP:

							obj.put(column_name, rs.getTimestamp(column_name));

							break;

						default:

							obj.put(column_name, rs.getObject(column_name));

							break;

						}

					}

					array.put(obj);
				}

			} catch (SQLIntegrityConstraintViolationException e) {
				JSONObject obj = new JSONObject();
				obj.put("Fehler", "FirmenID/FirmenName bereits vorhanden - keine Duplikate zulässig");
				array.put(obj);

			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rs != null) {
					try {
						rs.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (ps != null) {
					try {
						ps.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}

		out.print(array);
		out.flush();
		out.close();
	}

	@PostMapping("/uploadImage")
	@CrossOrigin
	public void uploadImage(HttpServletRequest request, HttpServletResponse response) throws IOException {

		response.reset();
		Part part = null;
		try {
			part = request.getPart("file");
			System.out.println(part.toString());
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			try {
				InputStream in = part.getInputStream();
				int i = 0;
				while ((i = in.read()) != -1) {
					baos.write(i);
				}
			} catch (IOException ex) {
				throw new ServletException(ex.getMessage());
			}

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ServletException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		response.setContentType("text/plain");
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write("File " + part.getName() + " successfully uploaded");

	}

	@PostMapping("/searchPep")
	@CrossOrigin
	public void searchPep(HttpServletResponse response, HttpServletRequest request) throws IOException {

		Connection con = Verbindung();

		response.setContentType("application/json");
		response.setHeader("Access-Control-Allow-Origin", "*");

		String suche = request.getParameter("suche");
		String _exakteSuche = request.getParameter("_exakteSuche");
		String liste = request.getParameter("liste");

		String su = suche.trim();
		String suchString = "";
		String welcheListe = liste;

		JSONArray nichtbekannt = new JSONArray();

		JSONArray array = new JSONArray();

		PreparedStatement ps1 = null;
		ResultSet rs1 = null;

		if (su.contains(" ")) {
			String[] splitString = su.split(" ");

			int laenge = splitString.length;
			int zahl = 0;
			if (_exakteSuche.equals("Ja")) {
				for (String s : splitString) {
					zahl++;
					if (zahl < laenge) {
						suchString += " '%" + s + "%' AND concat_Names LIKE ";
					} else {
						suchString += " '%" + s + "%'";
					}

				}

			}

		} else {
			if (su.contains("ü") || su.contains("Ü")) {
				suchString = "'%" + su + "%' OR concat_Names LIKE '%" + su.replace("ü", "ue").replace("Ü", "Ue") + "%'";
			} else if (su.contains("ue") || su.contains("Ue")) {
				suchString = "'%" + su + "%' OR concat_Names LIKE '%" + su.replace("ue", "ü").replace("Ue", "Ü") + "%'";
			} else if (su.contains("ö") || su.contains("Ö")) {
				suchString = "'%" + su + "%' OR concat_Names LIKE '%" + su.replace("ö", "oe").replace("Ö", "Oe") + "%'";
			} else if (su.contains("oe") || su.contains("Oe")) {
				suchString = "'%" + su + "%' OR concat_Names LIKE '%" + su.replace("oe", "ö").replace("Oe", "Ö") + "%'";
			} else if (su.contains("ae") || su.contains("Ae")) {
				suchString = "'%" + su + "%' OR concat_Names LIKE '%" + su.replace("ä", "ae").replace("Ä", "Ae") + "%'";
			} else if (su.contains("ä") || su.contains("Ä")) {
				suchString = "'%" + su + "%' OR concat_Names LIKE '%" + su.replace("ae", "ä").replace("Ae", "Ä") + "%'";
			} else if (su.contains("ss")) {
				suchString = "'%" + su + "%' OR concat_Names LIKE '%" + su.replace("ss", "ß") + "%'";
			} else if (su.contains("ß")) {
				suchString = "'%" + su + "%' OR concat_Names LIKE '%" + su.replace("ss", "ß") + "%'";
			} else {
				suchString = "'%" + su + "%'";
			}

		}

		if (con != null) {

			try {

				String query = "";
				if(liste.equals("beide"))
				{
					query= "SELECT * from zusammen WHERE concat_Names LIKE " + suchString
							+ " ORDER BY last_Name ASC LIMIT 50 ";
				}
				else if(liste.equals("nurPep"))
				{
					query= "SELECT * from zusammen WHERE concat_Names LIKE " + suchString
							+ " AND pep_sanktion ='pep' ORDER BY last_Name ASC LIMIT 50 ";
				}
				else
				{
					query= "SELECT * from zusammen WHERE concat_Names LIKE " + suchString
							+ " AND pep_sanktion ='sanktion' ORDER BY last_Name ASC LIMIT 50 ";
				}
				

				con.setAutoCommit(false);
				ps1 = con.prepareStatement(query);
//				ps1.setString(1, suchString);
//				ps1.setString(2, welcheListe);
//				ps1.setString(3, _exakteSuche);
				ps1.execute();
				rs1 = ps1.getResultSet();
				con.commit();

				ResultSetMetaData meta = rs1.getMetaData();

				int intRS = meta.getColumnCount();

				while (rs1.next()) {

					JSONObject obj = new JSONObject();

					if (rs1.getString("first_Name").equals("") && rs1.getString("last_Name").equals("")) {

						obj.put("id", rs1.getString("_id_fk"));

						obj.put("Unbekannt", "Ja");

						array.put(obj);
					}

					else

					{

						for (int i = 1; i < intRS + 1; i++) {

							String column_name = meta.getColumnName(i);

							switch (meta.getColumnType(i)) {

							case java.sql.Types.ARRAY:

								obj.put(column_name, rs1.getArray(column_name));

								break;

							case java.sql.Types.BIGINT:

								obj.put(column_name, rs1.getInt(column_name));

								break;

							case java.sql.Types.BOOLEAN:

								obj.put(column_name, rs1.getBoolean(column_name));

								break;

							case java.sql.Types.BLOB:

								obj.put(column_name, rs1.getBlob(column_name));

								break;

							case java.sql.Types.DOUBLE:

								obj.put(column_name, rs1.getDouble(column_name));

								break;

							case java.sql.Types.FLOAT:

								obj.put(column_name, rs1.getFloat(column_name));

								break;

							case java.sql.Types.INTEGER:

								obj.put(column_name, rs1.getInt(column_name));

								break;

							case java.sql.Types.NVARCHAR:

								obj.put(column_name, rs1.getNString(column_name));

								break;

							case java.sql.Types.VARCHAR:

								obj.put(column_name, rs1.getString(column_name));

								break;

							case java.sql.Types.TINYINT:

								obj.put(column_name, rs1.getInt(column_name));

								break;

							case java.sql.Types.SMALLINT:

								obj.put(column_name, rs1.getInt(column_name));

								break;

							case java.sql.Types.DATE:

								obj.put(column_name, rs1.getDate(column_name));

								break;

							case java.sql.Types.TIMESTAMP:

								obj.put(column_name, rs1.getTimestamp(column_name));

								break;

							default:

								obj.put(column_name, rs1.getObject(column_name));

								break;

							}

						}

						obj.put("Unbekannt", "Nein");
						array.put(obj);
					}

				}

			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rs1 != null) {
					try {
						rs1.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (ps1 != null) {
					try {
						ps1.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}

		PrintWriter out = response.getWriter();
		out.print(array);
		out.flush();
		out.close();

	}

	@GetMapping("/chartProFirma")
	public void ChartProFirma(HttpServletResponse response) throws IOException {
		Connection con = Verbindung();

		response.setContentType("application/json");

		JSONArray array = new JSONArray();

		if (con != null) {

			try {
				con.setAutoCommit(false);
				ps = con.prepareStatement("CALL ChartAnzahlProFirma();");

				rs = ps.executeQuery();
				con.commit();

				ResultSetMetaData meta = rs.getMetaData();

				int intRS = meta.getColumnCount();

				while (rs.next()) {
					JSONObject obj = new JSONObject();

					for (int i = 1; i < intRS + 1; i++) {

						String column_name = meta.getColumnName(i);

						switch (meta.getColumnType(i)) {

						case java.sql.Types.ARRAY:

							obj.put(column_name, rs.getArray(column_name));

							break;

						case java.sql.Types.BIGINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.BOOLEAN:

							obj.put(column_name, rs.getBoolean(column_name));

							break;

						case java.sql.Types.BLOB:

							obj.put(column_name, rs.getBlob(column_name));

							break;

						case java.sql.Types.DOUBLE:

							obj.put(column_name, rs.getDouble(column_name));

							break;

						case java.sql.Types.FLOAT:

							obj.put(column_name, rs.getFloat(column_name));

							break;

						case java.sql.Types.INTEGER:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.NVARCHAR:

							obj.put(column_name, rs.getNString(column_name));

							break;

						case java.sql.Types.VARCHAR:

							obj.put(column_name, rs.getString(column_name));

							break;

						case java.sql.Types.TINYINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.SMALLINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.DATE:

							obj.put(column_name, new SimpleDateFormat("dd.MM.yyyy").format(rs.getDate(column_name)));

							break;

						case java.sql.Types.TIMESTAMP:

							obj.put(column_name, rs.getTimestamp(column_name));

							break;

						default:

							obj.put(column_name, rs.getObject(column_name));

							break;

						}

					}

					array.put(obj);
				}

			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rs != null) {
					try {
						rs.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (ps != null) {
					try {
						ps.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}

		PrintWriter out = response.getWriter();
		out.print(array);
		out.flush();
		out.close();
	}

	@GetMapping("/chartGesamt")
	public void ChartProMonat(HttpServletResponse response) throws IOException {
		Connection con = Verbindung();

		response.setContentType("application/json");

		JSONArray array = new JSONArray();

		if (con != null) {

			try {
				con.setAutoCommit(false);
				ps = con.prepareStatement("CALL ChartAnzahlGesamtProMonat();");

				rs = ps.executeQuery();
				con.commit();

				ResultSetMetaData meta = rs.getMetaData();

				int intRS = meta.getColumnCount();

				while (rs.next()) {
					JSONObject obj = new JSONObject();

					for (int i = 1; i < intRS + 1; i++) {

						String column_name = meta.getColumnName(i);

						switch (meta.getColumnType(i)) {

						case java.sql.Types.ARRAY:

							obj.put(column_name, rs.getArray(column_name));

							break;

						case java.sql.Types.BIGINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.BOOLEAN:

							obj.put(column_name, rs.getBoolean(column_name));

							break;

						case java.sql.Types.BLOB:

							obj.put(column_name, rs.getBlob(column_name));

							break;

						case java.sql.Types.DOUBLE:

							obj.put(column_name, rs.getDouble(column_name));

							break;

						case java.sql.Types.FLOAT:

							obj.put(column_name, rs.getFloat(column_name));

							break;

						case java.sql.Types.INTEGER:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.NVARCHAR:

							obj.put(column_name, rs.getNString(column_name));

							break;

						case java.sql.Types.VARCHAR:

							obj.put(column_name, rs.getString(column_name));

							break;

						case java.sql.Types.TINYINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.SMALLINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.DATE:

							obj.put(column_name, new SimpleDateFormat("dd.MM.yyyy").format(rs.getDate(column_name)));

							break;

						case java.sql.Types.TIMESTAMP:

							obj.put(column_name, rs.getTimestamp(column_name));

							break;

						default:

							obj.put(column_name, rs.getObject(column_name));

							break;

						}

					}

					array.put(obj);
				}

			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rs != null) {
					try {
						rs.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (ps != null) {
					try {
						ps.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}

		PrintWriter out = response.getWriter();
		out.print(array);
		out.flush();
		out.close();
	}

	@PostMapping("/firmenKunden")
	@CrossOrigin
	public void firmenKunden(HttpServletRequest request, HttpServletResponse response) throws IOException {

		String firmenId = request.getParameter("firmenId");

		Connection con = Verbindung();

		response.setContentType("application/json");

		JSONArray array = new JSONArray();

		if (con != null) {

			try {
				con.setAutoCommit(false);
				ps = con.prepareStatement("CALL firmenKunden(?);");
				ps.setString(1, firmenId);
				rs = ps.executeQuery();
				con.commit();

				ResultSetMetaData meta = rs.getMetaData();

				int intRS = meta.getColumnCount();

				while (rs.next()) {
					JSONObject obj = new JSONObject();

					for (int i = 1; i < intRS + 1; i++) {

						String column_name = meta.getColumnName(i);

						switch (meta.getColumnType(i)) {

						case java.sql.Types.ARRAY:

							obj.put(column_name, rs.getArray(column_name));

							break;

						case java.sql.Types.BIGINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.BOOLEAN:

							obj.put(column_name, rs.getBoolean(column_name));

							break;

						case java.sql.Types.BLOB:

							obj.put(column_name, rs.getBlob(column_name));

							break;

						case java.sql.Types.DOUBLE:

							obj.put(column_name, rs.getDouble(column_name));

							break;

						case java.sql.Types.FLOAT:

							obj.put(column_name, rs.getFloat(column_name));

							break;

						case java.sql.Types.INTEGER:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.NVARCHAR:

							obj.put(column_name, rs.getNString(column_name));

							break;

						case java.sql.Types.VARCHAR:

							obj.put(column_name, rs.getString(column_name));

							break;

						case java.sql.Types.TINYINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.SMALLINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.DATE:

							if (rs.getDate(column_name) != null)
								obj.put(column_name, rs.getDate(column_name));

							break;

						case java.sql.Types.TIMESTAMP:

							if (rs.getDate(column_name) != null)
								obj.put(column_name, rs.getTimestamp(column_name));

							break;

						default:

							obj.put(column_name, rs.getObject(column_name));

							break;

						}

					}

					array.put(obj);
				}

			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rs != null) {
					try {
						rs.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (ps != null) {
					try {
						ps.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}

		PrintWriter out = response.getWriter();
		out.print(array);
		out.flush();
		out.close();
	}

	@PostMapping("/loescheKundeFromFirma")
	@CrossOrigin
	public void loescheKundeFromFirma(HttpServletRequest request, HttpServletResponse response) throws IOException {

		String userId = request.getParameter("userID");
		String firmenID = request.getParameter("firmenID");

		Connection con = Verbindung();

		response.setContentType("application/json");

		JSONObject obj = new JSONObject();
		JSONArray array = new JSONArray();

		obj.put("Status", "Erfolgreich gelöscht");

		array.put(obj);

		PrintWriter out = response.getWriter();

		if (con != null) {

			try {
				con.setAutoCommit(false);
				ps = con.prepareStatement("CALL userLoschen(?,?);");
				ps.setString(1, userId);
				ps.setString(2, firmenID);
				ps.executeUpdate();
				con.commit();

			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rs != null) {
					try {
						rs.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (ps != null) {
					try {
						ps.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}

		out.print(array);
		out.flush();
		out.close();

	}

	@PostMapping("/eineFirma")
	@CrossOrigin
	public void eineFirma(HttpServletRequest request, HttpServletResponse response) throws IOException {
		Connection con = Verbindung();

		response.setContentType("application/json");

		String firmenID = request.getParameter("firmenId");

		JSONArray array = new JSONArray();

		PreparedStatement psFirmen = null;
		ResultSet rsFirmen = null;
		if (con != null) {

			try {
				con.setAutoCommit(false);
				psFirmen = con.prepareStatement("CALL eineFirma(?);");
				psFirmen.setString(1, firmenID);

				psFirmen.execute();
				rsFirmen = psFirmen.getResultSet();
				con.commit();

				ResultSetMetaData meta = rsFirmen.getMetaData();

				int intRS = meta.getColumnCount();

				while (rsFirmen.next()) {
					JSONObject obj = new JSONObject();

					for (int i = 1; i < intRS + 1; i++) {

						String column_name = meta.getColumnName(i);

						switch (meta.getColumnType(i)) {

						case java.sql.Types.ARRAY:

							obj.put(column_name, rsFirmen.getArray(column_name));

							break;

						case java.sql.Types.BIGINT:

							obj.put(column_name, rsFirmen.getInt(column_name));

							break;

						case java.sql.Types.BOOLEAN:

							obj.put(column_name, rsFirmen.getBoolean(column_name));

							break;

						case java.sql.Types.BLOB:

							obj.put(column_name, rsFirmen.getBlob(column_name));

							break;

						case java.sql.Types.DOUBLE:

							obj.put(column_name, rsFirmen.getDouble(column_name));

							break;

						case java.sql.Types.FLOAT:

							obj.put(column_name, rsFirmen.getFloat(column_name));

							break;

						case java.sql.Types.INTEGER:

							obj.put(column_name, rsFirmen.getInt(column_name));

							break;

						case java.sql.Types.NVARCHAR:

							obj.put(column_name, rsFirmen.getNString(column_name));

							break;

						case java.sql.Types.VARCHAR:

							obj.put(column_name, rsFirmen.getString(column_name));

							break;

						case java.sql.Types.TINYINT:

							obj.put(column_name, rsFirmen.getInt(column_name));

							break;

						case java.sql.Types.SMALLINT:

							obj.put(column_name, rsFirmen.getInt(column_name));

							break;

						case java.sql.Types.DATE:

							obj.put(column_name,
									new SimpleDateFormat("dd.MM.yyyy").format(rsFirmen.getDate(column_name)));

							break;

						case java.sql.Types.TIMESTAMP:

							obj.put(column_name, rsFirmen.getTimestamp(column_name));

							break;

						default:

							obj.put(column_name, rsFirmen.getObject(column_name));

							break;

						}

					}

					array.put(obj);
				}

			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rsFirmen != null) {
					try {
						rsFirmen.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (psFirmen != null) {
					try {
						psFirmen.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}

		PrintWriter out = response.getWriter();
		out.print(array);
		out.flush();
		out.close();
	}

	@GetMapping("/customers")
	@CrossOrigin
	public void getCustomerForDetailView(String reihenfolge, HttpServletResponse response) throws IOException {
		Connection con = Verbindung();

		response.setContentType("application/json");

		JSONArray array = new JSONArray();

		PreparedStatement psFirmen = null;
		ResultSet rsFirmen = null;
		if (con != null) {

			try {
				con.setAutoCommit(false);
				psFirmen = con.prepareStatement("CALL firmenAuflistung(?);");
				psFirmen.setString(1, reihenfolge);

				psFirmen.execute();
				rsFirmen = psFirmen.getResultSet();
				con.commit();

				ResultSetMetaData meta = rsFirmen.getMetaData();

				int intRS = meta.getColumnCount();

				while (rsFirmen.next()) {
					JSONObject obj = new JSONObject();

					for (int i = 1; i < intRS + 1; i++) {

						String column_name = meta.getColumnName(i);

						switch (meta.getColumnType(i)) {

						case java.sql.Types.ARRAY:

							obj.put(column_name, rsFirmen.getArray(column_name));

							break;

						case java.sql.Types.BIGINT:

							obj.put(column_name, rsFirmen.getInt(column_name));

							break;

						case java.sql.Types.BOOLEAN:

							obj.put(column_name, rsFirmen.getBoolean(column_name));

							break;

						case java.sql.Types.BLOB:

							obj.put(column_name, rsFirmen.getBlob(column_name));

							break;

						case java.sql.Types.DOUBLE:

							obj.put(column_name, rsFirmen.getDouble(column_name));

							break;

						case java.sql.Types.FLOAT:

							obj.put(column_name, rsFirmen.getFloat(column_name));

							break;

						case java.sql.Types.INTEGER:

							obj.put(column_name, rsFirmen.getInt(column_name));

							break;

						case java.sql.Types.NVARCHAR:

							obj.put(column_name, rsFirmen.getNString(column_name));

							break;

						case java.sql.Types.VARCHAR:

							obj.put(column_name, rsFirmen.getString(column_name));

							break;

						case java.sql.Types.TINYINT:

							obj.put(column_name, rsFirmen.getInt(column_name));

							break;

						case java.sql.Types.SMALLINT:

							obj.put(column_name, rsFirmen.getInt(column_name));

							break;

						case java.sql.Types.DATE:

							obj.put(column_name,
									new SimpleDateFormat("dd.MM.yyyy").format(rsFirmen.getDate(column_name)));

							break;

						case java.sql.Types.TIMESTAMP:

							obj.put(column_name, rsFirmen.getTimestamp(column_name));

							break;

						default:

							obj.put(column_name, rsFirmen.getObject(column_name));

							break;

						}

					}

					array.put(obj);
				}

			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rsFirmen != null) {
					try {
						rsFirmen.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (psFirmen != null) {
					try {
						psFirmen.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}

		PrintWriter out = response.getWriter();
		out.print(array);
		out.flush();
		out.close();
	}

	@PostMapping("/sortBy")
	public void sortBy(@RequestParam(required = true) String sortierung, String suche, HttpServletResponse response)
			throws IOException {

		Connection con = Verbindung();

		response.setContentType("application/json");

		JSONArray array = new JSONArray();

		if (con != null) {

			try {
				con.setAutoCommit(false);
				ps = con.prepareStatement("CALL sortBy(?,?);");
				ps.setString(1, sortierung);
				ps.setString(2, suche);
				rs = ps.executeQuery();
				con.commit();

				ResultSetMetaData meta = rs.getMetaData();

				int intRS = meta.getColumnCount();

				while (rs.next()) {
					JSONObject obj = new JSONObject();

					for (int i = 1; i < intRS + 1; i++) {

						String column_name = meta.getColumnName(i);

						switch (meta.getColumnType(i)) {

						case java.sql.Types.ARRAY:

							obj.put(column_name, rs.getArray(column_name));

							break;

						case java.sql.Types.BIGINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.BOOLEAN:

							obj.put(column_name, rs.getBoolean(column_name));

							break;

						case java.sql.Types.BLOB:

							obj.put(column_name, rs.getBlob(column_name));

							break;

						case java.sql.Types.DOUBLE:

							obj.put(column_name, rs.getDouble(column_name));

							break;

						case java.sql.Types.FLOAT:

							obj.put(column_name, rs.getFloat(column_name));

							break;

						case java.sql.Types.INTEGER:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.NVARCHAR:

							obj.put(column_name, rs.getNString(column_name));

							break;

						case java.sql.Types.VARCHAR:

							obj.put(column_name, rs.getString(column_name));

							break;

						case java.sql.Types.TINYINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.SMALLINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.DATE:

							obj.put(column_name, rs.getDate(column_name));

							break;

						case java.sql.Types.TIMESTAMP:

							obj.put(column_name, rs.getTimestamp(column_name));

							break;

						default:

							obj.put(column_name, rs.getObject(column_name));

							break;

						}

					}

					array.put(obj);

				}
			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rs != null) {
					try {
						rs.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (ps != null) {
					try {
						ps.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}

		PrintWriter out = response.getWriter();
		out.print(array);
		out.flush();
		out.close();
	}

	@GetMapping("/logout")
	@CrossOrigin
	public void logout(HttpServletRequest request, HttpServletResponse response) throws IOException {

		response.setHeader("Access-Control-Allow-Origin", "*");
		HttpSession session = request.getSession();

		if (!session.isNew()) {
			session.invalidate();
		}
		try {
			request.getRequestDispatcher("http://localhost:3000/").forward(request, response);
		} catch (ServletException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	@GetMapping("/getByCountry")
	@CrossOrigin
	public void getByCountry(@RequestParam(required = true) String country, HttpServletResponse response,
			HttpServletRequest request) throws IOException {

//		HttpSession session = request.getSession(false);
//
//		if (session != null) {

		Connection con = Verbindung();

		response.setContentType("application/json");
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Methods", "POST");

		JSONArray array = new JSONArray();
		if (con != null) {

			try {
				con.setAutoCommit(false);
				ps = con.prepareStatement("CALL getFromCountry(?);");
				ps.setString(1, country);
				rs = ps.executeQuery();
				con.commit();

				ResultSetMetaData meta = rs.getMetaData();

				int intRS = meta.getColumnCount();

				while (rs.next()) {
					JSONObject obj = new JSONObject();

					for (int i = 1; i < intRS + 1; i++) {

						String column_name = meta.getColumnName(i);

						switch (meta.getColumnType(i)) {

						case java.sql.Types.ARRAY:

							obj.put(column_name, rs.getArray(column_name));

							break;

						case java.sql.Types.BIGINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.BOOLEAN:

							obj.put(column_name, rs.getBoolean(column_name));

							break;

						case java.sql.Types.BLOB:

							obj.put(column_name, rs.getBlob(column_name));

							break;

						case java.sql.Types.DOUBLE:

							obj.put(column_name, rs.getDouble(column_name));

							break;

						case java.sql.Types.FLOAT:

							obj.put(column_name, rs.getFloat(column_name));

							break;

						case java.sql.Types.INTEGER:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.NVARCHAR:

							obj.put(column_name, rs.getNString(column_name));

							break;

						case java.sql.Types.VARCHAR:

							obj.put(column_name, rs.getString(column_name));

							break;

						case java.sql.Types.TINYINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.SMALLINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.DATE:

							obj.put(column_name, rs.getDate(column_name));

							break;

						case java.sql.Types.TIMESTAMP:

							obj.put(column_name, rs.getTimestamp(column_name));

							break;

						default:

							obj.put(column_name, rs.getObject(column_name));

							break;

						}

					}

					array.put(obj);
				}
			} catch (SQLException e) {
				getByCountry("Germany", response, request);
				e.printStackTrace();
			} finally {
				if (rs != null) {
					try {
						rs.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (ps != null) {
					try {
						ps.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}
		PrintWriter out = response.getWriter();
		out.print(array);
		out.flush();
		out.close();

//		} else {
//			return;
//		}
	}

	@PostMapping("/getOne")
	public void one(@RequestParam(required = true) String suche, HttpServletResponse response) throws IOException {
		Connection con = Verbindung();

		response.setContentType("application/json");
		JSONArray array = new JSONArray();
		if (con != null) {

			try {
				con.setAutoCommit(false);
				ps = con.prepareStatement("CALL getOne(?);");
				ps.setString(1, suche);
				rs = ps.executeQuery();
				con.commit();

				ResultSetMetaData meta = rs.getMetaData();

				int intRS = meta.getColumnCount();

				while (rs.next()) {
					JSONObject obj = new JSONObject();

					for (int i = 1; i < intRS + 1; i++) {

						String column_name = meta.getColumnName(i);

						switch (meta.getColumnType(i)) {

						case java.sql.Types.ARRAY:

							obj.put(column_name, rs.getArray(column_name));

							break;

						case java.sql.Types.BIGINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.BOOLEAN:

							obj.put(column_name, rs.getBoolean(column_name));

							break;

						case java.sql.Types.BLOB:

							obj.put(column_name, rs.getBlob(column_name));

							break;

						case java.sql.Types.DOUBLE:

							obj.put(column_name, rs.getDouble(column_name));

							break;

						case java.sql.Types.FLOAT:

							obj.put(column_name, rs.getFloat(column_name));

							break;

						case java.sql.Types.INTEGER:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.NVARCHAR:

							obj.put(column_name, rs.getNString(column_name));

							break;

						case java.sql.Types.VARCHAR:

							obj.put(column_name, rs.getString(column_name));

							break;

						case java.sql.Types.TINYINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.SMALLINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.DATE:

							obj.put(column_name, rs.getDate(column_name));

							break;

						case java.sql.Types.TIMESTAMP:

							obj.put(column_name, rs.getTimestamp(column_name));

							break;

						default:

							obj.put(column_name, rs.getObject(column_name));

							break;

						}

					}

					array.put(obj);
				}
			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rs != null) {
					try {
						rs.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (ps != null) {
					try {
						ps.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}
		PrintWriter out = response.getWriter();
		out.print(array);
		out.flush();
		out.close();
	}

	@GetMapping("/getAbfragen")
	public void Abfragen(@RequestParam(required = true) String _user, @RequestParam(required = true) String limit,
			HttpServletResponse response) throws IOException {

		Connection con = Verbindung();

		response.setContentType("application/json");
		JSONArray array = new JSONArray();
		if (con != null) {

			try {
				con.setAutoCommit(false);
				ps = con.prepareStatement("CALL getAbfragen(?,?);");
				ps.setString(1, _user);
				ps.setString(2, limit);
				rs = ps.executeQuery();
				con.commit();

				ResultSetMetaData meta = rs.getMetaData();

				int intRS = meta.getColumnCount();

				while (rs.next()) {
					JSONObject obj = new JSONObject();

					for (int i = 1; i < intRS + 1; i++) {

						String column_name = meta.getColumnName(i);

						switch (meta.getColumnType(i)) {

						case java.sql.Types.ARRAY:

							obj.put(column_name, rs.getArray(column_name));

							break;

						case java.sql.Types.BIGINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.BOOLEAN:

							obj.put(column_name, rs.getBoolean(column_name));

							break;

						case java.sql.Types.BLOB:

							obj.put(column_name, rs.getBlob(column_name));

							break;

						case java.sql.Types.DOUBLE:

							obj.put(column_name, rs.getDouble(column_name));

							break;

						case java.sql.Types.FLOAT:

							obj.put(column_name, rs.getFloat(column_name));

							break;

						case java.sql.Types.INTEGER:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.NVARCHAR:

							obj.put(column_name, rs.getNString(column_name));

							break;

						case java.sql.Types.VARCHAR:

							obj.put(column_name, rs.getString(column_name));

							break;

						case java.sql.Types.TINYINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.SMALLINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.DATE:

							obj.put(column_name, new SimpleDateFormat("dd.MM.yyyy").format(rs.getDate(column_name)));

							break;

						case java.sql.Types.TIMESTAMP:

							obj.put(column_name, rs.getTimestamp(column_name));

							break;

						default:

							obj.put(column_name, rs.getObject(column_name));

							break;

						}

					}

					array.put(obj);
				}
			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rs != null) {
					try {
						rs.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (ps != null) {
					try {
						ps.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}
		PrintWriter out = response.getWriter();
		out.print(array);
		out.flush();
		out.close();
	}

	@PostMapping("/saveLogIn")
	public void saveLogIn(@RequestParam(required = true) String daten, @RequestParam(required = true) String userId,
			HttpServletResponse response) throws IOException {

		Connection con = Verbindung();

		JSONObject o = new JSONObject(daten);

		System.out.println(o.toString());
		System.out.println(o.getString("country_code"));
		System.out.println(o.getString("country_capital"));

		if (con != null) {

			try {
				con.setAutoCommit(false);
				ps = con.prepareStatement("CALL saveLoginPerson(?,?,?,?,?,?,?,?,?,?);");
				ps.setString(1, o.getString("city"));
				ps.setString(2, o.getString("ip"));
				ps.setString(3, o.getString("region"));
				ps.setString(4, o.getString("country_code"));
				ps.setString(5, o.getString("country_capital"));
				ps.setString(6, o.getString("country_name"));
				ps.setString(7, o.getString("postal"));
				ps.setString(8, String.valueOf(o.getDouble("latitude")));
				ps.setString(9, String.valueOf(o.getDouble("longitude")));
				ps.setInt(10, Integer.parseInt(userId));

				ps.executeUpdate();

				con.commit();

			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rs != null) {
					try {
						rs.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (ps != null) {
					try {
						ps.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}

	}

	@GetMapping("/singleUser")
	public void singleUser(@RequestParam(required = true) String id, HttpServletResponse response,
			HttpServletRequest request) throws IOException {

		Connection con = Verbindung();

		response.setContentType("application/json");
		JSONArray array = new JSONArray();

		if (con != null) {

			try {
				con.setAutoCommit(false);
				ps = con.prepareStatement("CALL getOneCustomer(?);");
				ps.setString(1, id);
				rs = ps.executeQuery();
				con.commit();

				ResultSetMetaData meta = rs.getMetaData();

				int intRS = meta.getColumnCount();

				while (rs.next()) {
					JSONObject obj = new JSONObject();

					for (int i = 1; i < intRS + 1; i++) {

						String column_name = meta.getColumnName(i);

						switch (meta.getColumnType(i)) {

						case java.sql.Types.ARRAY:

							obj.put(column_name, rs.getArray(column_name));

							break;

						case java.sql.Types.BIGINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.BOOLEAN:

							obj.put(column_name, rs.getBoolean(column_name));

							break;

						case java.sql.Types.BLOB:

							obj.put(column_name, rs.getBlob(column_name));

							break;

						case java.sql.Types.DOUBLE:

							obj.put(column_name, rs.getDouble(column_name));

							break;

						case java.sql.Types.FLOAT:

							obj.put(column_name, rs.getFloat(column_name));

							break;

						case java.sql.Types.INTEGER:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.NVARCHAR:

							obj.put(column_name, rs.getNString(column_name));

							break;

						case java.sql.Types.VARCHAR:

							obj.put(column_name, rs.getString(column_name));

							break;

						case java.sql.Types.TINYINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.SMALLINT:

							obj.put(column_name, rs.getInt(column_name));

							break;

						case java.sql.Types.DATE:

							obj.put(column_name, new SimpleDateFormat("dd.MM.yyyy").format(rs.getDate(column_name)));

							break;

						case java.sql.Types.TIMESTAMP:

							obj.put(column_name, rs.getTimestamp(column_name));

							break;

						default:

							obj.put(column_name, rs.getObject(column_name));

							break;

						}

					}

					array.put(obj);
				}
			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rs != null) {
					try {
						rs.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (ps != null) {
					try {
						ps.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}

		PrintWriter out = response.getWriter();
		out.print(array);
		out.flush();
		out.close();

	}

	@PostMapping("/updateFirma")
	@CrossOrigin
	public void updateFirma(HttpServletResponse response, HttpServletRequest request) throws IOException {

		String firmenId = request.getParameter("firmenId");

		String firmenName_ = request.getParameter("firmenName_");

		Connection con = Verbindung();

		response.setContentType("application/json");

		if (con != null) {

			try {
				con.setAutoCommit(false);
				ps = con.prepareStatement("CALL updateFirma(?,?);");

				ps.setString(1, firmenId);
				ps.setString(2, firmenName_);

				ps.executeUpdate();
				con.commit();

			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rs != null) {
					try {
						rs.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (ps != null) {
					try {
						ps.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}

		PrintWriter out = response.getWriter();
		out.write("Erfolgreich aktualisiert");
		out.flush();
		out.close();

	}

	@PostMapping("/updateSingleUser")
	@CrossOrigin
	public void updateSingleUser(HttpServletResponse response, HttpServletRequest request) throws IOException {

		String firmenId = request.getParameter("firmenId");
		String kundenID = request.getParameter("userID");
		String anrede = request.getParameter("anrede");
		String vorname = request.getParameter("vorname");
		String nachname = request.getParameter("nachname");
		String email = request.getParameter("email");

		Connection con = Verbindung();

		response.setContentType("application/json");

		if (con != null) {

			try {
				con.setAutoCommit(false);
				ps = con.prepareStatement("CALL updateUser(?,?,?,?,?,?);");
				ps.setString(1, kundenID);
				ps.setString(2, anrede);
				ps.setString(3, vorname);
				ps.setString(4, nachname);
				ps.setString(5, email);
				ps.setString(6, firmenId);
				ps.executeUpdate();
				con.commit();

			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rs != null) {
					try {
						rs.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (ps != null) {
					try {
						ps.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}

		PrintWriter out = response.getWriter();
		out.write("Erfolgreich aktualisiert");
		out.flush();
		out.close();

	}

	@GetMapping("/merken")
	@CrossOrigin
	public void merken(@RequestParam(required = true) String id_kunde, @RequestParam(required = true) String id_pdf,
			@RequestParam(required = true) String key, String vorname, String nachname, HttpServletResponse response,
			HttpServletRequest request) throws IOException, NoSuchAlgorithmException, NoSuchPaddingException,
			IllegalBlockSizeException, BadPaddingException, InvalidKeyException, InvalidAlgorithmParameterException {

		Connection con = Verbindung();

		response.setContentType("application/json");
		JSONArray array = new JSONArray();

		if (con != null) {

			try {
				con.setAutoCommit(false);
				ps = con.prepareStatement("CALL merken(?,?,?,?,?);");
				ps.setString(1, id_kunde);
				ps.setString(2, id_pdf);
				ps.setString(3, key);
				ps.setString(4, vorname);
				ps.setString(5, nachname);

				ps.executeUpdate();
				con.commit();

			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rs != null) {
					try {
						rs.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (ps != null) {
					try {
						ps.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}

	}

	@PostMapping("/VerlaufAbfragen")
	@CrossOrigin
	public void VerlaufAbfragen(HttpServletResponse response, HttpServletRequest request)
			throws IOException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException,
			BadPaddingException, InvalidKeyException, InvalidAlgorithmParameterException {

		Connection con = Verbindung();

		response.setContentType("application/json");
		JSONArray array = new JSONArray();
		ResultSet rsGemerkt = null;
		PreparedStatement psGemerkt = null;
		
		
		String von = request.getParameter("von");
		String bis = request.getParameter("bis");
		
		SimpleDateFormat df = new SimpleDateFormat("dd.MM.yyyy");
		Date d1 = null;
		Date d2 = null;
		java.sql.Date sqlDateVon = null;
		java.sql.Date sqlDateBis = null;

		try {
			d1 = df.parse(von);
			d2 = df.parse(bis);

			sqlDateVon = new java.sql.Date(d1.getTime());
			sqlDateBis = new java.sql.Date(d2.getTime());

		} catch (ParseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}


		if (con != null) {

			try {
				con.setAutoCommit(false);
				psGemerkt = con.prepareStatement("CALL verlaufAnzeigen(?,?)");
				psGemerkt.setString(1, sqlDateVon.toString());
				psGemerkt.setString(2, sqlDateBis.toString());

				psGemerkt.execute();
				rsGemerkt = psGemerkt.getResultSet();
				con.commit();

				ResultSetMetaData meta = rsGemerkt.getMetaData();

				int intRS = meta.getColumnCount();

				while (rsGemerkt.next()) {
					JSONObject obj = new JSONObject();

					for (int i = 1; i < intRS + 1; i++) {

						String column_name = meta.getColumnName(i);

						switch (meta.getColumnType(i)) {

						case java.sql.Types.ARRAY:

							obj.put(column_name, rsGemerkt.getArray(column_name));

							break;

						case java.sql.Types.BIGINT:

							obj.put(column_name, rsGemerkt.getInt(column_name));

							break;

						case java.sql.Types.BOOLEAN:

							obj.put(column_name, rsGemerkt.getBoolean(column_name));

							break;

						case java.sql.Types.BLOB:

							obj.put(column_name, rsGemerkt.getBlob(column_name));

							break;

						case java.sql.Types.DOUBLE:

							obj.put(column_name, rsGemerkt.getDouble(column_name));

							break;

						case java.sql.Types.FLOAT:

							obj.put(column_name, rsGemerkt.getFloat(column_name));

							break;

						case java.sql.Types.INTEGER:

							obj.put(column_name, rsGemerkt.getInt(column_name));

							break;

						case java.sql.Types.NVARCHAR:

							obj.put(column_name, rsGemerkt.getNString(column_name));

							break;

						case java.sql.Types.VARCHAR:

							obj.put(column_name, rsGemerkt.getString(column_name));

							break;

						case java.sql.Types.TINYINT:

							obj.put(column_name, rsGemerkt.getInt(column_name));

							break;

						case java.sql.Types.SMALLINT:

							obj.put(column_name, rsGemerkt.getInt(column_name));

							break;

						case java.sql.Types.DATE:

							if (rsGemerkt.getDate(column_name) != null)
								obj.put(column_name, rsGemerkt.getDate(column_name));

							break;

						case java.sql.Types.TIMESTAMP:
							if (rsGemerkt.getTimestamp(column_name) != null)
								obj.put(column_name, rsGemerkt.getTimestamp(column_name));

							break;

						default:

							obj.put(column_name, rsGemerkt.getObject(column_name));

							break;

						}

					}

					array.put(obj);
				}

			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rsGemerkt != null) {
					try {
						rsGemerkt.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (psGemerkt != null) {
					try {
						psGemerkt.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}

		PrintWriter out = response.getWriter();
		out.print(array);
		out.flush();
		out.close();
	}

	@GetMapping("/gemerkt")
	@CrossOrigin
	public void gemerkt(@RequestParam(required = true) String id_kunde, HttpServletResponse response,
			HttpServletRequest request) throws IOException, NoSuchAlgorithmException, NoSuchPaddingException,
			IllegalBlockSizeException, BadPaddingException, InvalidKeyException, InvalidAlgorithmParameterException {

		Connection con = Verbindung();

		response.setContentType("application/json");
		JSONArray array = new JSONArray();
		ResultSet rsGemerkt = null;
		PreparedStatement psGemerkt = null;
		if (con != null) {

			try {
				con.setAutoCommit(false);
				psGemerkt = con.prepareStatement("CALL gemerkt(?);");
				psGemerkt.setString(1, id_kunde);

				psGemerkt.execute();
				rsGemerkt = psGemerkt.getResultSet();
				con.commit();

				ResultSetMetaData meta = rsGemerkt.getMetaData();

				int intRS = meta.getColumnCount();

				while (rsGemerkt.next()) {
					JSONObject obj = new JSONObject();

					for (int i = 1; i < intRS + 1; i++) {

						String column_name = meta.getColumnName(i);

						switch (meta.getColumnType(i)) {

						case java.sql.Types.ARRAY:

							obj.put(column_name, rsGemerkt.getArray(column_name));

							break;

						case java.sql.Types.BIGINT:

							obj.put(column_name, rsGemerkt.getInt(column_name));

							break;

						case java.sql.Types.BOOLEAN:

							obj.put(column_name, rsGemerkt.getBoolean(column_name));

							break;

						case java.sql.Types.BLOB:

							obj.put(column_name, rsGemerkt.getBlob(column_name));

							break;

						case java.sql.Types.DOUBLE:

							obj.put(column_name, rsGemerkt.getDouble(column_name));

							break;

						case java.sql.Types.FLOAT:

							obj.put(column_name, rsGemerkt.getFloat(column_name));

							break;

						case java.sql.Types.INTEGER:

							obj.put(column_name, rsGemerkt.getInt(column_name));

							break;

						case java.sql.Types.NVARCHAR:

							obj.put(column_name, rsGemerkt.getNString(column_name));

							break;

						case java.sql.Types.VARCHAR:

							obj.put(column_name, rsGemerkt.getString(column_name));

							break;

						case java.sql.Types.TINYINT:

							obj.put(column_name, rsGemerkt.getInt(column_name));

							break;

						case java.sql.Types.SMALLINT:

							obj.put(column_name, rsGemerkt.getInt(column_name));

							break;

						case java.sql.Types.DATE:

							if (rsGemerkt.getDate(column_name) != null)
								obj.put(column_name, rsGemerkt.getDate(column_name));

							break;

						case java.sql.Types.TIMESTAMP:
							if (rsGemerkt.getTimestamp(column_name) != null)
								obj.put(column_name, rsGemerkt.getTimestamp(column_name));

							break;

						default:

							obj.put(column_name, rsGemerkt.getObject(column_name));

							break;

						}

					}

					array.put(obj);
				}

			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rsGemerkt != null) {
					try {
						rsGemerkt.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (psGemerkt != null) {
					try {
						psGemerkt.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}

		PrintWriter out = response.getWriter();
		out.print(array);
		out.flush();
		out.close();
	}

	@PostMapping("/logIn")
	@CrossOrigin
	public void logIn(@RequestParam(required = true) String passwort, @RequestParam(required = true) String email,
			HttpServletResponse response, HttpServletRequest request)
			throws IOException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException,
			BadPaddingException, InvalidKeyException, InvalidAlgorithmParameterException {

		HttpSession session = request.getSession(true);

		Connection con = Verbindung();

		response.setContentType("application/json");
		JSONArray array = new JSONArray();

		if (con != null && session != null) {

			try {
				con.setAutoCommit(false);
				ps = con.prepareStatement("CALL logIn(?,?);");
				ps.setString(1, email);
				ps.setString(2, passwort);
				rs = ps.executeQuery();
				con.commit();

				ResultSetMetaData meta = rs.getMetaData();

				int intRS = meta.getColumnCount();

				while (rs.next()) {

					if (rs.getString("passwort") != null) {

//						byte[] bytekeyEntschluesseln = hexStringToByteArray(key);
//						SecretKeySpec sksEntschluesseln = new SecretKeySpec(bytekeyEntschluesseln, S_GetPeps.AES);
//						Cipher cipherEntschluesseln = Cipher.getInstance(S_GetPeps.AES);
//						cipherEntschluesseln.init(Cipher.DECRYPT_MODE, sksEntschluesseln);
//						byte[] decrypted = cipherEntschluesseln.doFinal(hexStringToByteArray(rs.getString("passwort")));
//						String OriginalPassword = new String(decrypted);
//						System.out.println("****************  Original Password  ****************");
//						System.out.println(OriginalPassword);
//						System.out.println("****************  Original Password  ****************");

						if (rs.getString("passwort").equals(passwort)) {

							session.setAttribute("Rolle", rs.getString("rolle"));
							session.setAttribute("Vorname", rs.getString("vorname"));
							session.setAttribute("Nachname", rs.getString("nachname"));
							session.setAttribute("Email", rs.getString("email"));
							session.setAttribute("id", rs.getString("_id"));

							JSONObject obj = new JSONObject();

							for (int i = 1; i < intRS + 1; i++) {

								String column_name = meta.getColumnName(i);

								switch (meta.getColumnType(i)) {

								case java.sql.Types.ARRAY:

									obj.put(column_name, rs.getArray(column_name));

									break;

								case java.sql.Types.BIGINT:

									obj.put(column_name, rs.getInt(column_name));

									break;

								case java.sql.Types.BOOLEAN:

									obj.put(column_name, rs.getBoolean(column_name));

									break;

								case java.sql.Types.BLOB:

									obj.put(column_name, rs.getBlob(column_name));

									break;

								case java.sql.Types.DOUBLE:

									obj.put(column_name, rs.getDouble(column_name));

									break;

								case java.sql.Types.FLOAT:

									obj.put(column_name, rs.getFloat(column_name));

									break;

								case java.sql.Types.INTEGER:

									obj.put(column_name, rs.getInt(column_name));

									break;

								case java.sql.Types.NVARCHAR:

									obj.put(column_name, rs.getNString(column_name));

									break;

								case java.sql.Types.VARCHAR:

									obj.put(column_name, rs.getString(column_name));

									break;

								case java.sql.Types.TINYINT:

									obj.put(column_name, rs.getInt(column_name));

									break;

								case java.sql.Types.SMALLINT:

									obj.put(column_name, rs.getInt(column_name));

									break;

								case java.sql.Types.DATE:

									if (rs.getDate(column_name) != null)
										obj.put(column_name,rs.getDate(column_name));

									break;

								case java.sql.Types.TIMESTAMP:

									obj.put(column_name, rs.getDate(column_name));

									break;

								default:

									obj.put(column_name, rs.getObject(column_name));

									break;

								}

							}

							array.put(obj);
						} else {
							return;
						}

					}

				}
			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rs != null) {
					try {
						rs.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (ps != null) {
					try {
						ps.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}

		PrintWriter out = response.getWriter();
		out.print(array);
		out.flush();
		out.close();
	}

	@CrossOrigin
	@GetMapping("/getKundenAbfragen")
	public void getKundenAbfragen(@RequestParam(required = true) String kundenId, HttpServletResponse response)
			throws IOException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException,
			BadPaddingException, InvalidKeyException, InvalidAlgorithmParameterException {

		Connection con = Verbindung();

		response.setContentType("application/json");
		response.setHeader("Access-Control-Allow-Origin", "*");

		JSONArray array = new JSONArray();
		PreparedStatement psUser = null;
		if (con != null) {

			try {

				psUser = con.prepareStatement("CALL getOneUser(?);");
				psUser.setString(1, kundenId);
				psUser.execute();

				try (ResultSet rs = psUser.getResultSet()) {

					ResultSetMetaData meta = rs.getMetaData();

					int intRS = meta.getColumnCount();

					while (rs.next()) {

						JSONObject obj = new JSONObject();

						for (int i = 1; i < intRS + 1; i++) {

							String column_name = meta.getColumnName(i);

							switch (meta.getColumnType(i)) {

							case java.sql.Types.ARRAY:

								obj.put(column_name, rs.getArray(column_name));

								break;

							case java.sql.Types.BIGINT:

								obj.put(column_name, rs.getInt(column_name));

								break;

							case java.sql.Types.BOOLEAN:

								obj.put(column_name, rs.getBoolean(column_name));

								break;

							case java.sql.Types.BLOB:

								obj.put(column_name, rs.getBlob(column_name));

								break;

							case java.sql.Types.DOUBLE:

								obj.put(column_name, rs.getDouble(column_name));

								break;

							case java.sql.Types.FLOAT:

								obj.put(column_name, rs.getFloat(column_name));

								break;

							case java.sql.Types.INTEGER:

								obj.put(column_name, rs.getInt(column_name));

								break;

							case java.sql.Types.NVARCHAR:

								obj.put(column_name, rs.getNString(column_name));

								break;

							case java.sql.Types.VARCHAR:

								obj.put(column_name, rs.getString(column_name));

								break;

							case java.sql.Types.TINYINT:

								obj.put(column_name, rs.getInt(column_name));

								break;

							case java.sql.Types.SMALLINT:

								obj.put(column_name, rs.getInt(column_name));

								break;

							case java.sql.Types.DATE:

								if (rs.getDate(column_name) != null)
									obj.put(column_name, rs.getDate(column_name));

								break;

							case java.sql.Types.TIMESTAMP:

								if (rs.getTimestamp(column_name) != null)
									obj.put(column_name, rs.getDate(column_name));

								break;

							default:

								obj.put(column_name, rs.getObject(column_name));

								break;

							}

						}

						array.put(obj);

					}

				}
			} catch (SQLException e) {

				e.printStackTrace();
			} finally {
				if (rs != null) {
					try {
						rs.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (ps != null) {
					try {
						psUser.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if (con != null) {
					try {
						con.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}

		PrintWriter out = response.getWriter();
		out.print(array);
		out.flush();
		out.close();
	}

	@SuppressWarnings("unused")
	private String verschluesseln(String pw) throws NoSuchAlgorithmException, NoSuchPaddingException,
			IllegalBlockSizeException, BadPaddingException, InvalidKeyException, InvalidAlgorithmParameterException {

		KeyGenerator keyGen = KeyGenerator.getInstance(S_GetPeps.AES);
		keyGen.init(128);
		SecretKey sk = keyGen.generateKey();
		key = byteArrayToHexString(sk.getEncoded());
		System.out.println("key:" + key);

		byte[] bytekey = hexStringToByteArray(key);
		SecretKeySpec sks = new SecretKeySpec(bytekey, S_GetPeps.AES);
		Cipher cipher = Cipher.getInstance(S_GetPeps.AES);
		cipher.init(Cipher.ENCRYPT_MODE, sks, cipher.getParameters());
		byte[] encrypted = cipher.doFinal(pw.getBytes());
		String encryptedpwd = byteArrayToHexString(encrypted);
		System.out.println("****************  Encrypted Password  ****************");
		System.out.println(encryptedpwd);
		System.out.println("****************  Encrypted Password  ****************");

		return encryptedpwd;
	}

	private static String byteArrayToHexString(byte[] b) {
		StringBuffer sb = new StringBuffer(b.length * 2);
		for (int i = 0; i < b.length; i++) {
			int v = b[i] & 0xff;
			if (v < 16) {
				sb.append('0');
			}
			sb.append(Integer.toHexString(v));
		}
		return sb.toString().toUpperCase();
	}

	private static byte[] hexStringToByteArray(String s) {
		byte[] b = new byte[s.length() / 2];
		for (int i = 0; i < b.length; i++) {
			int index = i * 2;
			int v = Integer.parseInt(s.substring(index, index + 2), 16);
			b[i] = (byte) v;
		}
		return b;
	}

	private Connection Verbindung() {

		return Datenbankverbindung.Verbindung();

	}

}
