package chat.sdju.servlets;

import com.alibaba.fastjson2.JSON;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class ConfigManager {
    public static ChatConfig getConfigFromFile() {
        // 指定文件在resources文件夹下的路径（相对路径）
        String filePath = "config.json";

        // 使用ClassLoader加载文件
        ClassLoader classLoader = ConfigManager.class.getClassLoader();
        InputStream inputStream = classLoader.getResourceAsStream(filePath);

        String fileContent = "";

        if (inputStream != null) {
            try {
                // 使用InputStreamReader和BufferedReader一次性读取整个文件内容
                BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
                StringBuilder stringBuilder = new StringBuilder();
                String line;

                while ((line = reader.readLine()) != null) {
                    stringBuilder.append(line).append("\n"); // 每行添加到StringBuilder中
                }

                fileContent = stringBuilder.toString(); // 将StringBuilder转换为字符串

            } catch (IOException e) {
                System.err.println("Read config error: " + e.getMessage());
            } finally {
                try {
                    inputStream.close(); // 关闭输入流
                } catch (IOException e) {
                    System.err.println("Can't close the input stream: " + e.getMessage());
                }
            }
        } else {
            System.err.println("Can't open the config file!");
            return null;
        }

        if (fileContent.isEmpty())
            return null;

        return JSON.parseObject(fileContent, ChatConfig.class);
    }

    public static ChatConfig getConfig() {
        ChatConfig config = new ChatConfig();

        // 从环境变量中获取相关信息
        config.setMysqlAddress(System.getenv("MYSQL_ADDRESS"));
        config.setMysqlPort(System.getenv("MYSQL_PORT"));
        config.setMysqlUserName(System.getenv("MYSQL_USERNAME"));
        config.setMysqlPassword(System.getenv("MYSQL_PASSWORD"));
        config.setMysqlDataBase(System.getenv("MYSQL_DATABASE"));
        config.setProfileImageUploadAddress(System.getenv("PROFILE_IMAGE_UPLOAD_ADDRESS"));
        config.setPicSiteUrl(System.getenv("PIC_SITE_URL"));

        return config;
    }
}
