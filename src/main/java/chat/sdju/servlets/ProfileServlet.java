package chat.sdju.servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.*;

@WebServlet("/ProfileServlet")
public class ProfileServlet extends HttpServlet {
    private final ChatConfig chatConfig = ConfigManager.getConfig();
    private final String sqlusername = chatConfig.getMysqlUserName();
    private final String sqlpassword = chatConfig.getMysqlPassword();
    private final String url = chatConfig.getSqlFullUrl();

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String userId = request.getParameter("user_id");
        System.out.println(userId);

        PreparedStatement pstmt = null;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            // 建立数据库连接
            Connection conn = DriverManager.getConnection(url, sqlusername, sqlpassword);

            // 从User表中读取数据
            String sql = "SELECT * FROM User where user_id = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, userId);
            ResultSet rs = pstmt.executeQuery();

            // 将数据显示在个人资料展示页面上
            if (rs.next()) {
                request.setAttribute("user_id", rs.getString("user_id"));
                request.setAttribute("nickname", rs.getString("nickname"));
                request.setAttribute("sex", rs.getString("sex").equals("Male") ? "男" : "女");
                request.setAttribute("email", rs.getString("email"));
                request.setAttribute("birthday", rs.getString("birthday"));
                request.setAttribute("address", rs.getString("address").replace("&", "&nbsp"));
                request.setAttribute("personal_profile", rs.getString("personal_profile"));
                request.setAttribute("user_icon", rs.getString("user_icon"));
                request.getRequestDispatcher("./Profile/index.jsp").forward(request, response);
            } else {
                response.getWriter().write("user not found !");
            }

            rs.close();
            pstmt.close();
            conn.close();
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
