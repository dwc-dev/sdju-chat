package chat.sdju.servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/VerifyServlet")
public class VerifyServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String user_id = req.getParameter("user_id");
        String verify_key = req.getParameter("verify_key");
        if (user_id != null && verify_key != null) {
            if (!verify_key.equals("ShnZ$V2yHrKilovecxk3Z!~5v")) {
                resp.setStatus(400);
                resp.getWriter().write("u are rejected!");
                return;
            }
            String key = (String) req.getServletContext().getAttribute(user_id);
            if (key != null) {
                resp.getWriter().write("{\"key\":\"" + key + "\"}");
            } else {
                resp.getWriter().write("{\"key\":" + "null" + "}");
            }
        } else {
            resp.setStatus(400);
            resp.getWriter().write("u should provide all parameters!");
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }
}