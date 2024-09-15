package chat.sdju.servlets;

import com.alibaba.fastjson2.JSON;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Writer;
import java.net.URLDecoder;
import java.sql.*;
import java.util.Map;

@WebServlet("/Login/ResetPasswordServlet")
public class ResetPasswordServlet extends HttpServlet {

    Connection connection = null;
    PreparedStatement preparedStatement = null;
    ResultSet resultSet = null;
    String user_id = null;

    private final ChatConfig chatConfig = ConfigManager.getConfig();
    private final String sqlusername = chatConfig.getMysqlUserName();
    private final String sqlpassword = chatConfig.getMysqlPassword();
    private final String url = chatConfig.getSqlFullUrl();

    public void connectsql() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
        try {
            connection = DriverManager.getConnection(url, sqlusername, sqlpassword);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("utf-8");
        connectsql();
        try {
            Map<String, String> map = getJSON(request);
//            System.out.println(map);
            String step = map.get("step");
//            System.out.println(step);

            if (step == null) {
                throw new IllegalArgumentException("Step Error");
            }

            switch (step) {
                case "1":
                    user_id = map.get("username");
                    handleStep1(request, response);
                    break;
                case "2":
                    String answer1 = URLDecoder.decode(map.get("answer1"), "UTF-8");
                    String answer2 = URLDecoder.decode(map.get("answer2"), "UTF-8");
                    String answer3 = URLDecoder.decode(map.get("answer3"), "UTF-8");
//                    System.out.println(answer1 + " " + answer2 + " " + answer3);
                    handleStep2(answer1, answer2, answer3, response);
                    break;
                case "3":
                    String newpassword = map.get("newpassword");
                    handleStep3(newpassword, response);
                    break;
                default:
                    response.sendError(400, "Invalid step parameter");
            }
        } catch (Exception e) {
            response.sendError(500, "Internal Server Error: " + e.getMessage());
        }
    }

    private void handleStep1(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Writer writer = response.getWriter();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        if (ifIdExist()) {
            response.getWriter().write("{\"msg\": \"success\"}");
        } else {
            response.setStatus(400);
            response.getWriter().write("{\"msg\": \"找不到账号\"}");
        }
    }

    private void handleStep2(String answer1, String answer2, String answer3, HttpServletResponse response) {
        try {
            String query = "SELECT answer1, answer2, answer3 FROM Reset_password WHERE user_id = ?";
            preparedStatement = connection.prepareStatement(query);
//            System.out.println(user_id);
            preparedStatement.setString(1, user_id);
            resultSet = preparedStatement.executeQuery();

            if (!resultSet.next()) {
                System.out.println("result error");
                response.sendError(500);
                return;
            }

            int count = 0;
            if (resultSet.getString("answer1").equals(answer1))
                count++;
            if (resultSet.getString("answer2").equals(answer2))
                count++;
            if (resultSet.getString("answer3").equals(answer3))
                count++;

            if (count >= 2) //三个对两个就行
                response.getWriter().write("{\"msg\": \"success\"}");
            else {
                response.setStatus(400);
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                response.getWriter().write("{\"msg\": \"验证身份信息失败\"}");
            }

        } catch (SQLException ex) {
            System.out.println("SQLException: " + ex.getMessage());
            System.out.println("SQLState: " + ex.getSQLState());
            System.out.println("VendorError: " + ex.getErrorCode());
            try {
                response.sendError(500);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if (resultSet != null)
                    resultSet.close();
                if (preparedStatement != null)
                    preparedStatement.close();
                if (connection != null)
                    connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    private void handleStep3(String newpassword, HttpServletResponse response) {
        String sql = "UPDATE User SET password = ? WHERE user_id = ?";
        try {
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, newpassword);
            preparedStatement.setString(2, user_id);

            int rowsUpdated = preparedStatement.executeUpdate();

            if (rowsUpdated > 0) {
                response.getWriter().write("{\"msg\": \"success\"}");
            } else {
                response.sendError(500, "Failed to update password");
            }
        } catch (SQLException | IOException e) {
            throw new RuntimeException(e);
        } finally {
            try {
                if (preparedStatement != null)
                    preparedStatement.close();
                if (connection != null)
                    connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }


    private boolean ifIdExist() {
        try {
            String sql = "SELECT user_id FROM User WHERE user_id = ?";
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, user_id);
            resultSet = preparedStatement.executeQuery();

            return resultSet.next();

        } catch (SQLException ex) {
            System.out.println("SQLException: " + ex.getMessage());
            System.out.println("SQLState: " + ex.getSQLState());
            System.out.println("VendorError: " + ex.getErrorCode());
            return false;
        } finally {
            try {
                if (resultSet != null)
                    resultSet.close();
                if (preparedStatement != null)
                    preparedStatement.close();
                if (connection != null)
                    connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    private Map<String, String> getJSON(HttpServletRequest request) throws IOException {
        BufferedReader streamReader = new BufferedReader(new InputStreamReader(request.getInputStream(), "UTF-8"));
        StringBuilder responseStrBuilder = new StringBuilder();
        String inputStr;
        while ((inputStr = streamReader.readLine()) != null) {
            responseStrBuilder.append(inputStr);
        }
        Map<String, String> params = JSON.parseObject(responseStrBuilder.toString(), Map.class);

        return params;
    }
}
