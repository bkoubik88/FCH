package com.check.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Datenbankverbindung {

	private final static String user = "auditcheck_New";
	private final static String password = "3072inneB@";
	private final static String verbindung = "jdbc:mysql://136.243.94.117:3306/audit?user="+user+"&password="+password;
	
	public static Connection Verbindung() {
		
		Connection conn = null;
		try {
			
			try {
				Class.forName("com.mysql.cj.jdbc.Driver");
				conn = DriverManager.getConnection(verbindung);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		} finally {
			System.out.println(conn);
		}
		return conn;
		
	}
}
