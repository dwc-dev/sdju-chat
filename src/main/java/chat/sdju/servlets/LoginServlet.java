package chat.sdju.servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.Writer;
import java.sql.*;
import java.util.Random;

@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {

    private final ChatConfig chatConfig = ConfigManager.getConfig();
    private final String sqlusername = chatConfig.getMysqlUserName();
    private final String sqlpassword = chatConfig.getMysqlPassword();
    private final String url = chatConfig.getSqlFullUrl();

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String userid = request.getParameter("username");
        String password = request.getParameter("password");
        //System.out.println(userid);
        //System.out.println(password);


        LoginResult loginResult = verify(userid, password);
        Writer writer = response.getWriter();

        if (loginResult == LoginResult.LOGIN_SUCCESS) {
            String key = generateRandomString(30);
            String free = request.getParameter("free");
            Cookie c1 = new Cookie("user_id", userid);
            Cookie c2 = new Cookie("user_key", key);
            if ("true".equals(free)) {
                c1.setMaxAge(60 * 60 * 72);
                c2.setMaxAge(60 * 60 * 72);
                request.getSession().setAttribute("free", true);
            } else {
                c1.setMaxAge(-1);
                c2.setMaxAge(-1);
                request.getSession().setAttribute("free", false);
            }
            request.getServletContext().setAttribute(userid, key);
            request.getSession().setAttribute("user_id", userid);
            response.addCookie(c1);
            response.addCookie(c2);
            response.sendRedirect("./ChatMain/");
        } else if (loginResult == LoginResult.ACCOUNT_NOT_FOUND) {
            request.setAttribute("msg", "账号不存在！");
            request.getRequestDispatcher("./Login/err.jsp").forward(request, response);
        } else if (loginResult == LoginResult.PASSWORD_ERROR) {
            request.setAttribute("msg", "密码错误！");
            request.getRequestDispatcher("./Login/err.jsp").forward(request, response);
        } else {
            response.sendError(500);
        }
    }

    public enum LoginResult {
        LOGIN_SUCCESS,      // 登录成功
        PASSWORD_ERROR,     // 密码错误
        ACCOUNT_NOT_FOUND,  // 账号不存在
        DATABASE_ERROR      // 数据库错误
    }

    private LoginResult verify(String username, String password) {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");


            connection = DriverManager.getConnection(url, sqlusername, sqlpassword);

            String sql = "SELECT password FROM User WHERE user_id = ?";
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, username);
            System.out.println(preparedStatement.toString());
            resultSet = preparedStatement.executeQuery();

            if (resultSet.next()) {
                String storedPassword = resultSet.getString("password");
                if (password.equals(storedPassword)) {
                    return LoginResult.LOGIN_SUCCESS;
                } else {
                    return LoginResult.PASSWORD_ERROR;
                }
            } else {
                return LoginResult.ACCOUNT_NOT_FOUND;
            }

        } catch (ClassNotFoundException e) {
            System.out.println("ClassNotFoundException");
            return LoginResult.DATABASE_ERROR;
        } catch (SQLException ex) {
            System.out.println("SQLException: " + ex.getMessage());
            System.out.println("SQLState: " + ex.getSQLState());
            System.out.println("VendorError: " + ex.getErrorCode());
            return LoginResult.DATABASE_ERROR;
        } finally {
            try {
                if (resultSet != null) resultSet.close();
                if (preparedStatement != null) preparedStatement.close();
                if (connection != null) connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    private String generateRandomString(int length) {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder randomString = new StringBuilder(length);
        Random random = new Random();

        for (int i = 0; i < length; i++) {
            int index = random.nextInt(characters.length());
            char randomChar = characters.charAt(index);
            randomString.append(randomChar);
        }

        return randomString.toString();
    }
}