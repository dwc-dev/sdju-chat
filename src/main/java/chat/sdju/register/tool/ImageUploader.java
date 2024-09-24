package chat.sdju.register.tool;

import java.io.DataOutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class ImageUploader {
    public static boolean uploadImage(String imageData, String imageName, String serverUrl) {
        try {
            URL url = new URL(serverUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);

            String jsonInputString = String.format("{\"data\":\"%s\", \"name\":\"%s\"}", imageData, imageName);

            try (DataOutputStream outputStream = new DataOutputStream(connection.getOutputStream())) {
                outputStream.writeBytes(jsonInputString);
                outputStream.flush();
            }

            int responseCode = connection.getResponseCode();

            connection.disconnect();

            return responseCode == HttpURLConnection.HTTP_OK;


        } catch (Exception e) {
            return false;
        }
    }
}
