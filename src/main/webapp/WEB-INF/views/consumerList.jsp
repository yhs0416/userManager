<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>회원관리 시스템 - 회원 목록</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
        <a class="navbar-brand" href="#">회원관리 시스템</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item active">
                    <a class="nav-link" href="#">홈 <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">회원 목록</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">회원 추가</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">로그아웃</a>
                </li>
                <li class="nav-item">
                    <span class="navbar-text" id="user-name"></span>
                </li>
            </ul>
        </div>
    </div>
</nav>

<main class="container mt-4">
    <h2>회원 목록</h2>
    <div class="row">
        <div class="col-md-6">
            <input type="text" class="form-control mb-2" id="search-input" placeholder="검색어 입력">
        </div>
    </div>
    <table class="table">
        <thead>
            <tr>
                <th>이름</th>
                <th>이메일</th>
                <th>전화번호</th>
            </tr>
        </thead>
        <tbody id="member-list">
            <!-- 여기에 회원 목록이 동적으로 추가될 것입니다. -->
        </tbody>
    </table>
</main>

<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

<script>
    // 예시로 회원 리스트를 보여주는 함수
    function showMemberList() {
        // 실제로는 서버에서 회원 목록을 가져와야 하지만, 여기서는 예시 데이터를 사용합니다.
        var members = [
            { name: "홍길동", email: "hong@example.com", phone: "010-1234-5678" },
            { name: "김철수", email: "kim@example.com", phone: "010-5678-1234" },
            { name: "이영희", email: "lee@example.com", phone: "010-9876-5432" }
        ];

        var memberListHtml = '';

        members.forEach(function (member) {
            memberListHtml += '<tr>';
            memberListHtml += '<td>' + member.name + '</td>';
            memberListHtml += '<td>' + member.email + '</td>';
            memberListHtml += '<td>' + member.phone + '</td>';
            memberListHtml += '</tr>';
        });

        $('#member-list').html(memberListHtml);
    }

    // 페이지 로드 시 회원 리스트 보여주기
    $(document).ready(function () {
        showMemberList();
    });
</script>

</body>
</html>