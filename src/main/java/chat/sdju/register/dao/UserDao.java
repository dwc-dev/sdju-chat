package chat.sdju.register.dao;

import chat.sdju.register.entity.User;

public interface UserDao {
    public boolean addUser(User user);

    public boolean findSameId(int user_id);

    public boolean addQuestion(int user_id, String qs1, String qs2, String qs3);
}
