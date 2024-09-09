<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <script src="./Tools/sweetalert2.all.min.js"></script>
</head>
<body>
<script>
    Swal.fire({
        icon: "error",
        title: "Error...",
        text: "${msg}"
    }).then((result) => {
        window.history.back();
    });
</script>
</body>
</html>