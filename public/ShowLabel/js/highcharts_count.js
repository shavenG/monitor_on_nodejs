$(function(){
    // $.getJSON("http://localhost:3000/services/getCountResult",function(data){
        var chart = new Highcharts.Chart({
            chart:{
                renderTo :"containers"
            },
            title:{
                text:""
            },
            xAxis:{
                categories:["3.20","3.21","3.22","3.23","3.24","3.25","3.26"],
                labels:{
                    rotation:90,
                    align:"left",
                    y:5,
                    x:-8
                }
            },
            yAxis:[{
                min:0,
                title:{
                    text:'条'
                },
                labels:{
                    formatter:function(){
                        return this.value;
                    }
                }
            },{
                min:0,
                title:{
                    text:'阅读率'
                },
                labels:{
                    formatter:function(){
                        return this.value;
                    }
                },
                opposite:1
            }],
            legend:{
                borderWidth:0.5,
                itemStyle:{
                    fontSize:10
                },
                margin:10,
                lineHeight: 30
            },
            plotOptions:{
                areaspline :{
                    fillOpacity: .25
                }
            },
            series:[{
                name:"当日采集数",
                type:"column",
                data:[123,156,219,129,174,205,198]
            },{
                name:"当日阅读数",
                type:"column",
                data:[123,106,269,199,194,105,198]
            },{
                name:"阅读率",
                type:"line",
                yAxis:1,
                data:[0.5,0.7,0.4,0.9,0.85,0.75,0.85]
            }]
        });
    // });
});