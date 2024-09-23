package chat.sdju.register.servlet;

import chat.sdju.register.dao.UserDaoImpl;
import chat.sdju.register.entity.User;
import chat.sdju.register.tool.ImageUploader;
import chat.sdju.servlets.ConfigManager;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;


@WebServlet("/RegisterServlet")
public class RegisterServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        UserDaoImpl userDao = new UserDaoImpl();
        User user = new User();

        //id处理检测重复
        Random random = new Random();
        int id = 0;

        while (true) {
            id = random.nextInt(9000000) + 1000000;
            boolean ret = userDao.findSameId(id);
            if (ret == false) break;
        }

        //头像地址处理
        //https://blog.csdn.net/qq_36706878/article/details/101828960
        String base64 = request.getParameter("avatar_base64");
        String name = "headIcon_" + id;
        String urlString = "";
        boolean f = ImageUploader.uploadImage(base64, name, ConfigManager.getConfig().getProfileImageUploadAddress());
        if (f) {
            urlString = "https://chat.picbox.fun/pic/" + name + ".webp";
        } else {
            System.out.println("Fail to upload avatar");
            response.setStatus(502);
            return;
        }

        //	地区处理
        //	dictionary:省表
        //	dictionary1:国家表
        String country = null;
        String province = null;
        Map<Integer, String> dictionary = new HashMap<>();
        dictionary.put(34, "安徽");
        dictionary.put(11, "北京");
        dictionary.put(50, "重庆");
        dictionary.put(35, "福建");
        dictionary.put(62, "甘肃");
        dictionary.put(44, "广东");
        dictionary.put(45, "广西");
        dictionary.put(52, "贵州");
        dictionary.put(46, "海南");
        dictionary.put(13, "河北");
        dictionary.put(23, "黑龙江");
        dictionary.put(41, "河南");
        dictionary.put(42, "湖北");
        dictionary.put(43, "湖南");
        dictionary.put(15, "内蒙古");
        dictionary.put(32, "江苏");
        dictionary.put(36, "江西");
        dictionary.put(22, "吉林");
        dictionary.put(21, "辽宁");
        dictionary.put(64, "宁夏");
        dictionary.put(63, "青海");
        dictionary.put(14, "山西");
        dictionary.put(37, "山东");
        dictionary.put(31, "上海");
        dictionary.put(51, "四川");
        dictionary.put(12, "天津");
        dictionary.put(54, "西藏");
        dictionary.put(65, "新疆");
        dictionary.put(53, "云南");
        dictionary.put(33, "浙江");
        dictionary.put(61, "陕西");
        dictionary.put(71, "台湾地区");
        dictionary.put(81, "香港地区");
        dictionary.put(82, "澳门地区");
        Map<Integer, String> dictionary1 = new HashMap<Integer, String>();
        dictionary1.put(1, "中国");
        //province赋值
        province = dictionary.get(Integer.parseInt(request.getParameter("province")));

        //country赋值
        //System.out.println(Integer.parseInt(request.getParameter("country")));
        country = dictionary1.get(Integer.parseInt(request.getParameter("country")));
        //System.out.println(country);
        String address = country + "&" + province;
        //System.out.println(address);
        user.setUser_id(id);
        user.setPassword(request.getParameter("password"));
        user.setNickname(request.getParameter("nickname"));
        user.setSex(request.getParameter("gender"));
        user.setUser_icon(urlString);
        user.setEmail(request.getParameter("email"));
        user.setBirthday(request.getParameter("birthday"));
        user.setAddress(address);
        user.setPersonal_profile(request.getParameter("introduction"));
        userDao.addUser(user);

        //密保问题
        String sq1 = request.getParameter("securityQuestion1");
        String sq2 = request.getParameter("securityQuestion2");
        String sq3 = request.getParameter("securityQuestion3");
        userDao.addQuestion(id, sq1, sq2, sq3);
        request.setAttribute("id", id);
        request.getRequestDispatcher("./Register/prompt.jsp").forward(request, response);
    }

}
