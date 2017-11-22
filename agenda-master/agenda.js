(function(){
  console.log("Schedule...");
  var ui = {
    fields:document.querySelectorAll("input"),
    button:document.querySelector("button"),
    table:document.querySelector("tbody")
  };

  var validateFields = function(e){
    console.log("Validação", e);
    e.preventDefault();
    var errors = 0;
    var data = {};
    ui.fields.forEach(function(field) {
      // console.log(fi eld.value,field.value.trim().length);
      if(field.value.trim().length === 0){
          field.classList.add("error");
          errors ++;
      } else {
        field.classList.remove("error");
        // console.log(field.id, field.value);
        data[field.id] = field.value;
      }
    });
    console.log(errors,data);

    if( errors > 0){
      document.querySelector(".error").focus();
    } else{
      saveData(data);
    }
    // debugger;

  };

  var cleanFields = ()=>ui.fields.forEach( field =>field.value = ""); //Arrow function
      // console.log(field);



  var saveData = (contact)=>{ //Arrow function
    console.log(JSON.stringify(contact));
    // console.log(contact);
    var headers = new Headers();
    headers.append("Content-type", "application/json");
    var conf = {
      method: "POST",
      body:JSON.stringify(contact),
      headers:headers
    }

    fetch("http://localhost:3000/contacts", conf)
      .then((res)=>{ //Arrow function
        if (res.ok){
          cleanFields();
          listAll();
        }
      })
      .catch(function(err){
        console.error(err);
      });

  };
  var listAll = function(){
    // console.log("Listar");
    var headers = new Headers();
    headers.append("Content-type", "application/json");
    var conf = {
      method: "GET",
      headers:headers
    }

    fetch("http://localhost:3000/contacts", conf)
      .then((res)=>{
        // console.log(res.json());
        return res.json()
      })
      .then(function(list){
        console.table(list);
        var html = [];
        // list.sort();
        list.forEach(function(item){
          // console.log(item);
          var line = `<tr>
              <td>${item.id}</td>
              <td>${item.name}</td>
              <td>${item.email}</td>
              <td>${item.phone}</td>
              <td><a href="#" data-id="${item.id}">Excluir</a></td>
          </tr>`;
          html.push(line);
        });
        console.log(html.join(""));
        if(list.length === 0){
          html.push(`<tr>
            <td colspan="5">Não existem dados registrados!</td>
          </tr>`)
        }

        ui.table.innerHTML = html.join("")

      })
      .catch(function(err){
        console.error(err);
      });

  };

  var removeItem = function(e){
    e.preventDefault();
    var id = e.target.dataset.id;
    if(id){
      var headers = new Headers();
      headers.append("Content-type", "application/json");
      var conf = {
        method: "DELETE",
        headers
      };
      fetch(`http://localhost:3000/contacts/${id}`, conf)
      .then(listAll)
      .catch(err => console.log(err));
    }
  }

  var initalize = function(){
    // mapeando eventos
    // ui.button.onclick = validateFields;
    ui.button.addEventListener("click", validateFields);
    ui.table.addEventListener("click", removeItem);
    listAll();
  }();








console.log(ui);
})();
