// ฟังก์ชันสำหรับโหลดข้อมูลสินค้าทั้งหมด
function loadTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/products");
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            var trHTML = '';
            const objects = JSON.parse(this.responseText);
            for (let object of objects) {
                trHTML += '<tr>';
                trHTML += '<td>'+object['id']+'</td>';
                trHTML += '<td>'+object['product_name']+'</td>';
                trHTML += '<td>'+object['product_price']+'</td>';
                trHTML += '<td>'+object['product_cost']+'</td>';
                trHTML += '<td><img width="50px" src="'+object['product_image']+'" class="avatar"></td>';
                trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showUserEditBox('+object['id']+')">Edit</button>';
                trHTML += '<button type="button" class="btn btn-outline-danger" onclick="userDelete('+object['id']+')">Del</button></td>';
                trHTML += "</tr>";
            }
            document.getElementById("mytable").innerHTML = trHTML;
        }
    };
}

loadTable();

// ฟังก์ชันเปิด modal เพื่อสร้างสินค้าใหม่
function showUserCreateBox() {
    Swal.fire({
        title: 'เพิ่มสินค้าใหม่',
        html:
            '<input id="id" type="hidden">' +
            '<div class="mb-3"><label for="name" class="form-label">ชื่อสินค้า</label><input id="name" class="form-control" placeholder="ชื่อสินค้า"></div>' +
            '<div class="mb-3"><label for="price" class="form-label">ราคาขาย</label><input id="price" class="form-control" placeholder="ราคาขาย"></div>' +
            '<div class="mb-3"><label for="cost" class="form-label">ราคาต้นทุน</label><input id="cost" class="form-control" placeholder="ราคาต้นทุน"></div>' +
            '<div class="mb-3"><label for="image" class="form-label">URL รูปภาพ</label><input id="image" class="form-control" placeholder="URL รูปภาพ"></div>',
        focusConfirm: false,
        preConfirm: () => {
            userCreate();
        }
    });
}

// ฟังก์ชันสร้างสินค้าใหม่
function userCreate() {
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const cost = document.getElementById("cost").value;
    const image = document.getElementById("image").value;
      
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3000/add-product");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ 
        "product_name": name, 
        "product_price": price,
        "product_cost": cost,
        "product_image": image
    }));
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            Swal.fire('เพิ่มสินค้าสำเร็จ!');
            loadTable();
        }
    };
}

// ฟังก์ชันเรียกข้อมูลสินค้าและแสดง modal แก้ไข
function showUserEditBox(id) {
    console.log(id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/products");
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            const product = objects.find(obj => obj.id === id);
            
            Swal.fire({
                title: 'แก้ไขสินค้า',
                html:
                    '<input id="id" type="hidden" value="'+product['id']+'">' +
                    '<div class="mb-3"><label for="name" class="form-label">ชื่อสินค้า</label><input id="name" class="form-control" value="'+product['product_name']+'"></div>' +
                    '<div class="mb-3"><label for="price" class="form-label">ราคาขาย</label><input id="price" class="form-control" value="'+product['product_price']+'"></div>' +
                    '<div class="mb-3"><label for="cost" class="form-label">ราคาต้นทุน</label><input id="cost" class="form-control" value="'+product['product_cost']+'"></div>' +
                    '<div class="mb-3"><label for="image" class="form-label">URL รูปภาพ</label><input id="image" class="form-control" value="'+product['product_image']+'"></div>',
                focusConfirm: false,
                preConfirm: () => {
                    userEdit();
                }
            });
        }
    };
}

// ฟังก์ชันอัพเดตข้อมูลสินค้า
function userEdit() {
    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const cost = document.getElementById("cost").value;
    const image = document.getElementById("image").value;
      
    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "http://localhost:3000/update-product/"+id);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ 
        "product_name": name, 
        "product_price": price,
        "product_cost": cost,
        "product_image": image
    }));
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            Swal.fire('แก้ไขสินค้าสำเร็จ!');
            loadTable();
        }
    };
}

// ฟังก์ชันลบสินค้า
function userDelete(id) {
    Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: "คุณไม่สามารถย้อนกลับได้หลังจากนี้!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, ลบเลย!',
        cancelButtonText: 'ยกเลิก'
    }).then((result) => {
        if (result.isConfirmed) {
            const xhttp = new XMLHttpRequest();
            xhttp.open("DELETE", "http://localhost:3000/delete-product/"+id);
            xhttp.send();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    Swal.fire(
                        'ลบแล้ว!',
                        'สินค้าถูกลบเรียบร้อยแล้ว',
                        'success'
                    );
                    loadTable();
                }
            };
        }
    });
}