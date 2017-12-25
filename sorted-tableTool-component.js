function TableTool(obj,id) {
    this.data = obj,
    this.init(id)
}

TableTool.prototype = {
    init: function(id){
        this.createTable(id)
        this.bindSort()
        this.isFrozen()
    },
    createTable: function(id){
        var table = document.createElement('table')
        table.setAttribute('id',this.data.table_name)

        table.style.textAlign = "center"
        table.style.background = this.data.table_color
        table.style.borderCollapse = "collapse"

        var thead = document.createElement('thead')
        thead.style.background = this.data.head_color

        var thead_html = ''
        var tempHTML = ''
        for (var i=0; i<this.data.table_head.length; i++) {
            // 用符号代替升降序图片箭头
            if (this.data.isSort[i] == '1') {
                tempHTML = "</p><span data-index='1' class='asc'>↑</span>&nbsp<span data-index='1' class='des'>↓</span></th>"
            } else {
                tempHTML = "</p><span data-index='0'></span>&nbsp<span data-index='0'></span></th>"
            }
            thead_html += "<th name='" + this.data.table_head[i] + "' style='width:"+this.data.tdWH[0]+"px;height:"+this.data.tdWH[1]+"px'><p>"+this.data.table_head[i]+tempHTML
        }
        thead.innerHTML = thead_html
        table.appendChild(thead)

        var tbody = document.createElement('tbody')
        var tbody_html = ''

        for (var i in this.data.tbody_obj) {
            for (var j = 0; j < this.data.table_head.length; j++) {
                tbody_html += "<td style='width:"+this.data.tdWH[0]+"px;height:"+this.data.tdWH[1]+"px'>" + this.data.tbody_obj[i][j] + "</td>"        
            }
            tbody_html = tbody_html + "</tr>"
        }

        tbody.innerHTML = tbody_html
        table.appendChild(tbody)
        console.log(id)

        if (id === undefined) {
            var div = document.createElement('div')
            div.appendChild(table)
            document.body.appendChild(div)
        }else{
            document.getElementById(id).appendChild(table)
        }

        this.bindSort()
    },
    bindSort: function() {
        var span_newarr = []
        var span_arr = document.getElementById(this.data.table_name).getElementsByTagName('span')
        console.log(span_arr)
        for (var i = 0; i < span_arr.length; i++) {
            console.log(span_arr[i])
            span_newarr.push(span_arr[i])
        }
        var that = this
        span_newarr.forEach(function(item){
            item.style.cursor = "pointer"
            item.addEventListener("click",function(){
                if (this.getAttribute("class")=="asc") {
                    for (var x in that.data.table_head){
                        if (this.parentNode.getAttribute('name').toUpperCase() == that.data.table_head[x].toUpperCase()) {
                            that.sortUp(x)
                        }
                    }
                } else {
                    for (x in that.data.table_head) {
                        if (this.parentNode.getAttribute('name').toUpperCase() == that.data.table_head[x].toUpperCase()) {
                            that.sortDown(x)
                        }
                    }
                }
                that.isFrozen()
            },false)
        })
    },
    updateTbody: function() {
        var tbody = document.createElement('tbody')
        var tbody_html=''

        for (var i in this.data.tbody_obj) {
            for (var j = 0; j < this.data.table_head.length; j++) {
                tbody_html += "<td style='width:"+this.data.tdWH[0]+"px;height:"+this.data.tdWH[1]+"px'>" + this.data.tbody_obj[i][j] + "</td>"        
            }
            tbody_html = tbody_html + "</tr>"
        }

        tbody.innerHTML = tbody_html
        document.getElementById(this.data.table_name).removeChild(document.getElementById(this.data.table_name).lastElementChild)
        document.getElementById(this.data.table_name).appendChild(tbody)
    },
    sortUp: function(index) {
        // 引入一个newArr和newObj先来处理排序，index指代的是要排序科目在数组中的位置
        var sortData = this.data.tbody_obj,
            newArr = [],
            newObj = {}
        for (key in sortData) {
            newArr.push(sortData[key])
        }

        newArr.sort(function(a,b) {
            return a[index] - b[index]
        })

        for (var i = 0; i < newArr.length; i++) {
            newObj[i + 1] = newArr[i]
        }
        this.data.tbody_obj = newObj
        this.updateTbody()
    },
    sortDown: function(index) {
        var sortData = this.data.tbody_obj,
            newArr = [],
            newObj = {}
        for (key in sortData) {
            newArr.push(sortData[key])
        }

        newArr.sort(function(a,b){
            return b[index] - a[index]
        })

        for (var i = 0; i < newArr.length; i++) {
            newObj[i + 1] = newArr[i]
        }
        this.data.tbody_obj = newObj
        this.updateTbody()
    },
    isFrozen: function() {
        switch (this.data.isFrozen) {
            case 0:
                break
            case 1:
                var tableChoose = document.getElementById(this.data.table_name)
                var firstTr = tableChoose.childNodes[0]
                var tdh = this.data.tdWH[1]
                var tdw = this.data.tdWH[0]
                var that = this
                window.addEventListener("scroll", function() {
                    var scrolltop = document.documentElement.scrollTop || document.body.scrollTop
                    if ((scrolltop < tableChoose.offsetTop + tableChoose.clientHeight) && (scrolltop > tableChoose.offsetTop)) {
                        firstTr.style.position = "fixed"
                        firstTr.style.top = 0
                    } else {
                        firstTr.style.position = "inherit"
                    }
                }, false)
                break
            default:
            alert("isFrozen参数错误，对应首航冻结默认无冻结。")
            break
        }
    }
}

var table1 = new TableTool({
    table_name: "table1",
    table_head: ["Name", "Chinese", "Computer", "English"],
    isSort: [0, 1, 1, 1],
    tbody_obj: {
        1: ["小明", 20, 90, 40],
        2: ["小红", 90, 60, 90],
        3: ["小肛", 60, 100, 70],
        4: ["小3", 30, 50, 10],
        5: ["小鸟", 10, 20, 30]
    },
    tdWH: [200, 50],
    head_color: "#eee",
    table_color: "#F8C0FF",
    isFrozen:1
},'test1')
var table2 = new TableTool({
    table_name: "table2",
    table_head: ["Name", "Chinese", "Computer", "English"],
    isSort: [0, 1, 1, 1],
    tbody_obj: {
        1: ["小2", 20, 90, 40],
        2: ["小红", 90, 60, 90],
        3: ["小4", 60, 100, 70],
        4: ["小E", 60, 20, 70],
        5: ["小W", 60, 100, 60],
    },
    tdWH: [200, 50],
    head_color: "rgb(74,158,158)",
    table_color: "rgb(28,170,125)",
    isFrozen:0
},'test2')
var table3 = new TableTool({
    table_name: "table3",
    table_head: ["Name", "qwe", "ewq", "dsa"],
    isSort: [0, 1, 1, 1],
    tbody_obj: {
        1: ["小1", 20, 90, 40],
        2: ["小2", 90, 60, 90],
        3: ["小3", 60, 100, 70],
        4: ["小4", 60, 20, 70],
        5: ["小5", 60, 100, 60],
    },
    tdWH: [200, 50],
    head_color: "rgb(114,58,158)",
    table_color: "rgb(28,70,125)",
    isFrozen: 1
})