package chat.sdju.register.dao;

import chat.sdju.register.entity.User;
import chat.sdju.servlets.ChatConfig;
import chat.sdju.servlets.ConfigManager;

import java.sql.*;

public class UserDaoImpl implements UserDao {

    private final ChatConfig chatConfig = ConfigManager.getConfig();
    private final String sqlusername = chatConfig.getMysqlUserName();
    private final String sqlpassword = chatConfig.getMysqlPassword();
    private final String url = chatConfig.getSqlFullUrl();

    @Override
    public boolean addUser(User user) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        int rows = 0;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            String sql = "insert into User(user_id,password,nickname,sex,user_icon,email,birthday,address,personal_profile) value(?,?,?,?,?,?,?,?,?)";
            conn = DriverManager.getConnection(url, sqlusername, sqlpassword);
            pstmt = conn.prepareStatement(sql);
            pstmt.setLong(1, user.getUser_id());
            pstmt.setString(2, user.getPassword());
            pstmt.setString(3, user.getNickname());
            pstmt.setString(4, user.getSex());
            pstmt.setString(5, user.getUser_icon());
            pstmt.setString(6, user.getEmail());
            pstmt.setString(7, user.getBirthday());
            pstmt.setString(8, user.getAddress());
            pstmt.setString(9, user.getPersonal_profile());
            rows = pstmt.executeUpdate();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (pstmt != null)
                    pstmt.close();
                if (conn != null)
                    conn.close();

            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return rows > 0;
    }

    @Override
    public boolean findSameId(int user_id) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            String sql = "select user_id from User";
            conn = DriverManager.getConnection(url, sqlusername, sqlpassword);
            pstmt = conn.prepareStatement(sql);
            rs = pstmt.executeQuery();
            while (rs.next()) {
                if (user_id == rs.getInt("user_id"))
                    return true;
            }
//			for(int i = 0;rs.next();i++) {
//				if(user_id == rs.getInt("user_id"))
//					return true;
//			}
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (pstmt != null)
                    pstmt.close();
                if (conn != null)
                    conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return false;
    }

    @Override
    public boolean addQuestion(int user_id, String qs1, String qs2, String qs3) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        int rows = 0;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            String sql = "insert into Reset_password(user_id,question_id_1,answer1,question_id_2,answer2,question_id_3,answer3) value(?,?,?,?,?,?,?)";
            conn = DriverManager.getConnection(url, sqlusername, sqlpassword);
            pstmt = conn.prepareStatement(sql);

            pstmt.setInt(1, user_id);
            pstmt.setInt(2, 1);
            pstmt.setString(3, qs1);
            pstmt.setInt(4, 2);
            pstmt.setString(5, qs2);
            pstmt.setInt(6, 3);
            pstmt.setString(7, qs3);
            rows = pstmt.executeUpdate();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (pstmt != null)
                    pstmt.close();
                if (conn != null)
                    conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return rows > 0;
    }
}
