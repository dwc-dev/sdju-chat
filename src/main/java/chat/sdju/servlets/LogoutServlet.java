package chat.sdju.servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/LogoutServlet")
public class LogoutServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Cookie[] cookies = req.getCookies();
        String user_id = null, user_key = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("user_id")) {
                    user_id = cookie.getValue();
                }
                if (cookie.getName().equals("user_key")) {
                    user_key = cookie.getValue();
                }
            }
            if (user_id != null && user_key != null && user_key.equals((String) req.getServletContext().getAttribute(user_id))) {
                Cookie c1 = new Cookie("user_id", "");
                Cookie c2 = new Cookie("user_key", "");
                c1.setMaxAge(0);
                c2.setMaxAge(0);
                resp.addCookie(c1);
                resp.addCookie(c2);
                req.getServletContext().removeAttribute(user_id);
                resp.sendRedirect(req.getContextPath() + "/Login/");
            } else {
                resp.sendRedirect(req.getContextPath() + "/Login/");
            }
        } else {
            //别忘了考虑cookies==null时的情况
            resp.sendRedirect(req.getContextPath() + "/Login/");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }
}