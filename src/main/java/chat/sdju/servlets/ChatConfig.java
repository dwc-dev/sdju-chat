package chat.sdju.servlets;

public class ChatConfig {
    private String mysqlAddress;
    private String mysqlPort;

    private String mysqlUserName;

    private String mysqlPassword;

    private String mysqlDataBase;

    private String profileImageUploadAddress;

    private String picSiteUrl;

    public String getProfileImageUploadAddress() {
        return profileImageUploadAddress;
    }

    public String getPicSiteUrl() {
        return picSiteUrl;
    }

    public void setPicSiteUrl(String picSiteUrl) {
        this.picSiteUrl = picSiteUrl;
    }

    public void setProfileImageUploadAddress(String profileImageUploadAddress) {
        this.profileImageUploadAddress = profileImageUploadAddress;
    }

    public String getMysqlAddress() {
        return mysqlAddress;
    }

    public void setMysqlAddress(String mysqlAddress) {
        this.mysqlAddress = mysqlAddress;
    }

    public String getMysqlPort() {
        return mysqlPort;
    }

    public void setMysqlPort(String mysqlPort) {
        this.mysqlPort = mysqlPort;
    }

    public String getMysqlUserName() {
        return mysqlUserName;
    }

    public void setMysqlUserName(String mysqlUserName) {
        this.mysqlUserName = mysqlUserName;
    }

    public String getMysqlPassword() {
        return mysqlPassword;
    }

    public void setMysqlPassword(String mysqlPassword) {
        this.mysqlPassword = mysqlPassword;
    }

    public String getMysqlDataBase() {
        return mysqlDataBase;
    }

    public void setMysqlDataBase(String mysqlDataBase) {
        this.mysqlDataBase = mysqlDataBase;
    }

    public String getSqlFullUrl() {
        String serverIP = this.getMysqlAddress();
        String sqlPort = this.getMysqlPort();
        String sqlDataBase = this.getMysqlDataBase();
        return "jdbc:mysql://" + serverIP + ":" + sqlPort + "/" + sqlDataBase;
    }

    @Override
    public String toString() {
        return "ChatConfig{" +
                "mysqlAddress='" + mysqlAddress + '\'' +
                ", mysqlPort='" + mysqlPort + '\'' +
                ", mysqlUserName='" + mysqlUserName + '\'' +
                ", mysqlPassword='" + mysqlPassword + '\'' +
                ", mysqlDataBase='" + mysqlDataBase + '\'' +
                ", profileImageUploadAddress='" + profileImageUploadAddress + '\'' +
                ", picSiteUrl='" + picSiteUrl + '\'' +
                '}';
    }
}
