package chat.sdju.servlets;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebFilter(urlPatterns = {"/ChatMain/index.html", "/Login/index.html", "/index.html"})
public class LoginFilter extends HttpFilter {
    @Override
    protected void doFilter(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws IOException, ServletException {

        //System.out.println(ConfigManager.getConfig());
        String requestUrl = req.getRequestURI();
        if (requestUrl.contains("ChatMain")) {
            if (isLogin(req)) {
                chain.doFilter(req, res);
            } else {
                res.sendRedirect(req.getContextPath() + "/Login/");
            }
        } else if (requestUrl.contains("Login")) {
            if (isLogin(req)) {
                res.sendRedirect(req.getContextPath() + "/ChatMain/");
            } else {
                chain.doFilter(req, res);
            }
        } else {
            if (isLogin(req)) {
                res.sendRedirect(req.getContextPath() + "/ChatMain/");
            } else {
                res.sendRedirect(req.getContextPath() + "/Login/");
            }
        }
    }

    protected boolean isLogin(HttpServletRequest req) {
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
                req.getSession().setAttribute("user_id", user_id);
                return true;
            } else {
                return false;
            }
        } else {
            return false;//别忘了考虑cookies==null时的情况
        }
    }
}