import { Controller, Get, Post } from '@nestjs/common';
import * as xlsx from 'xlsx';
import { FileInterceptor } from '@nestjs/platform-express';
import * as levenshtein from 'fast-levenshtein';
import {Body} from '@nestjs/common';
import { log } from 'console';
import * as _ from 'lodash';
import { isEmpty } from 'rxjs';
import { isNull } from 'util';

@Controller('cats')
export class CatsController {

  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
  @Post('timkiem')
    findProduct(@Body() body) {
        //console.log(body.key)

        // đọc file csv gốc
   
        const sourceworkbook = xlsx.readFile('D:\\nestjs_tutorial\\tichhop\\src\\org_fulldata.xls');
        const sourcesheetName = sourceworkbook.SheetNames[0];
        const sourceworksheet = sourceworkbook.Sheets[sourcesheetName];
        const sourcejsonData = xlsx.utils.sheet_to_json(sourceworksheet, { header: 0 });
        const sourceheaderRow = sourcejsonData[0] as string[];
        // đọc file csv clusster
   
        const clusterworkbook = xlsx.readFile('D:\\nestjs_tutorial\\tichhop\\src\\output1f.xls');
        const clustersheetName = clusterworkbook.SheetNames[0];
        const clusterworksheet = clusterworkbook.Sheets[clustersheetName];
        const clusterjsonData = xlsx.utils.sheet_to_json(clusterworksheet, { header: 0 });
        const clusterheaderRow = clusterjsonData[0] as string[];
        // đọc file csv output1
   
        const outworkbook1 = xlsx.readFile('D:\\nestjs_tutorial\\tichhop\\src\\output1.xls');
        const outsheetName1 = outworkbook1.SheetNames[0];
        const outworksheet1 = outworkbook1.Sheets[outsheetName1];
        const outjsonData1 = xlsx.utils.sheet_to_json(outworksheet1, { header: 0 });
        const outheaderRow1 = outjsonData1[0] as string[];
        // đọc file csv output2
   
        const outworkbook2 = xlsx.readFile('D:\\nestjs_tutorial\\tichhop\\src\\output2.xls');
        const outsheetName2 = outworkbook2.SheetNames[0];
        const outworksheet2 = outworkbook2.Sheets[outsheetName2];
        const outjsonData2 = xlsx.utils.sheet_to_json(outworksheet2, { header: 0 });
        const outheaderRow2 = outjsonData2[0] as string[];
        // đọc cột name 
        // đọc file csv đối sánh
   
        const tempworkbook = xlsx.readFile('D:\\nestjs_tutorial\\tichhop\\src\\clean_full.xls');
        const tempsheetName = tempworkbook.SheetNames[0];
        const tempworksheet = tempworkbook.Sheets[tempsheetName];
        const tempjsonData = xlsx.utils.sheet_to_json(tempworksheet, { header: 0 });
        const tempheaderRow = tempjsonData[0] as string[];
        var keywordArray = body.key.split(" ");
        // kiểm tra bộ nhớ
        var len = keywordArray.length;
        var rom='';
        if ((keywordArray[len-1]).includes("gb")||(keywordArray[len-1]).includes("tb"))  {
          rom = keywordArray[len-1];
          len = len -1;
        }
        console.log(rom);
        // ghép lại phần tên
        var name ='';
        for(let i =0; i< len; i++){
            name = name + keywordArray[i];
            if (i < len-1) name = name +' ';
        }
        console.log(name);
        var arr= [];
       var product_cluster_num;
        //tìm theo từ khóa , nếu xuất hiện thì có thêm 1 lần xuất hiện trong mảng
          if(rom!=''){
            rom = rom.toUpperCase();
            var something;
            for (let i = 0; i < clusterjsonData.length; i++) {
                // Lấy giá trị của phần tử tại vị trí i
                var num = clusterjsonData[i]['level_0'];
                //console.log(num);
                for( let j=0; j< tempjsonData.length; j++){
                  if(tempjsonData[j]['product_num']==num){
                    something= tempjsonData[j];
                    break;
                  }
                }
                var temp = something['product_category']+' '+something['product_name'];
                temp = temp.toLowerCase();
                if (levenshtein.get(temp,name)==0 &&levenshtein.get(something['product_ram'],rom)==0 ){
                  // kiểm tra xem có sản phầm trùng với nó hay không
                  if(clusterjsonData[i]['level_1']===undefined){
                    for(let k=0; k< sourcejsonData.length; k++){
                      if(sourcejsonData[k]['product_num']==num) return sourcejsonData[k];
                    }
                  }
                  else{
                   // các sản phẩm có cluster sẽ bắt đầu xét 
                    var arr=[];
                    for(let l=0; l<outjsonData2.length; l++){
                      // kiểm tra trên cột lv_0 của putput2
                      if(outjsonData2[l]['level_0']==num){
                        //
                        for(let h=0; h< sourcejsonData.length; h++){
                          if(sourcejsonData[h]['product_num']==outjsonData2[l]['level_1']) 
                            arr.push(sourcejsonData[outjsonData2[l]['level_1']]);
                        }
                      }
                      // kiểm tra trên cột lv_1 của putput2
                      if(outjsonData2[l]['level_1']==num){
                        for(let e=0; e< sourcejsonData.length; e++){
                          if(sourcejsonData[e]['product_num']==outjsonData2[l]['level_0']) 
                          arr.push(sourcejsonData[outjsonData2[l]['level_0']]);
                        }
                      }

                    }
                    return arr;
                  }
                }
              }
          }
          else{
           // nếu tìm sản phẩm mà không tìm ram
           var something;
           for (let i = 0; i < clusterjsonData.length; i++) {
               // Lấy giá trị của phần tử tại vị trí i
               var num = clusterjsonData[i]['level_0'];
               //console.log(num);
               for( let j=0; j< tempjsonData.length; j++){
                 if(tempjsonData[j]['product_num']==num){
                   something= tempjsonData[j];
                   break;
                 }
               }
               var temp = something['product_category']+' '+something['product_name'];
               temp = temp.toLowerCase();
               if (levenshtein.get(temp,name)==0 ){
                 // kiểm tra xem có sản phầm trùng với nó hay không
                 if(clusterjsonData[i]['level_1']===undefined){
                   for(let k=0; k< sourcejsonData.length; k++){
                     if(sourcejsonData[k]['product_num']==num) return sourcejsonData[k];
                   }
                 }
                 else{
                  // các sản phẩm có cluster sẽ bắt đầu xét 
                   var arr=[];
                   for(let l=0; l<outjsonData1.length; l++){
                     // kiểm tra trên cột lv_0 của putput2
                     if(outjsonData1[l]['level_0']==num){
                       //
                       for(let h=0; h< sourcejsonData.length; h++){
                         if(sourcejsonData[h]['product_num']==outjsonData1[l]['level_1']) 
                           arr.push(sourcejsonData[outjsonData1[l]['level_1']]);
                       }
                     }
                     // kiểm tra trên cột lv_1 của putput2
                     if(outjsonData1[l]['level_1']==num){
                       for(let e=0; e< sourcejsonData.length; e++){
                         if(sourcejsonData[e]['product_num']==outjsonData1[l]['level_0']) 
                         arr.push(sourcejsonData[outjsonData1[l]['level_0']]);
                       }
                     }

                   }
                   return arr;
                 }
               }
             }
          }
          return 'Không có sản phẩm';
}
} 

