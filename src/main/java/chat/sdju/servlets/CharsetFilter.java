package chat.sdju.servlets;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebFilter(urlPatterns = {"/ChatMain/js/*", "/Login/js/*", "/Register/js/*", "/Tools/*", "/ChatMain/css/*", "/Login/css/*", "/Register/css/*"})
public class CharsetFilter extends HttpFilter {
    @Override
    protected void doFilter(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws IOException, ServletException {
        //https://blog.csdn.net/q863672107/article/details/122973380
        //调试时应在idea配置中加入"-Dfile.encoding=UTF-8"，否则会因ANSI编码介入产生错误
        req.setCharacterEncoding("utf-8");
        res.setCharacterEncoding("utf-8");
        chain.doFilter(req, res);
    }
}