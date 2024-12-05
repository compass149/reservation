export default class User{
    constructor(id, username, password, name, role, token, email, gender, createdAt, updatedAt,mobile) {
        /**사용자 고유 ID (Primary Key)**/
        this.uid = uid;
        /**사용자 로그인 id**/
        this.username = username;
        this.password = password;
        /**실명**/
        this.name = name;
        this.role = role;
        this.token = token;
        this.email = email;
        this.gender = gender;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.mobile = mobile;
    }
}