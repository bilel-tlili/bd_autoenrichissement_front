
import { Injectable } from '@angular/core';
import * as ExcelJs from 'exceljs/dist/exceljs.min.js';
import * as fs from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() {
  }
  generateExcel(result, media, fichier) {

    //Excel Title, Header, Data
    const title = 'Audit ' + media + ": " + fichier;

    if (media === 'telephone') {

      const stats_global = [
        ['Lignes en entrée', result.STATS_GLOB.Lignes_en_entree],
        ['Valide RNVP', result.STATS_GLOB.Valide_RNVP, result.STATS_GLOB.Valide_RNVPPercent + " %"],
        ['Téléphone', result.STATS_GLOB.Telephones, result.STATS_GLOB.TelephonesPercent + " %"],
        ['Téléphone actif', result.STATS_GLOB.Actifs, result.STATS_GLOB.ActifsPercent + " %"],
        ['Fixe', result.STATS_AAA.F_P_F.TOTAL_FIXE_FID_PF, result.STATS_GLOB.FixePercent + " %"],
        ['Fixe Actif', result.STATS_AAA.A_P_F.TOTAL_FIXE_ACTIF_PF, result.STATS_GLOB.FixeActifPercent + " %"],
        ['Mobile', result.STATS_AAA.F_P_M.TOTAL_MOBI_FID_PM, result.STATS_GLOB.MobilePercent + " %"],
        ['Mobile Actif', result.STATS_AAA.A_P_M.TOTAL_MOBI_ACTIF_PM, result.STATS_GLOB.MobileActifPercent + " %"],
        ['SMS Optin', result.STATS_GLOB.Sms, result.STATS_GLOB.SmsPercent + " %"],
      ]

      const header1 = ["Comptage Actif ", '', '', ''];
      const header2 = ["Priorité Mobile", '', '', ''];
      const header = ['Enrichissement', 'Amabis', 'OptinData', 'Total'];
      const header3 = ["Priorité Fixe", '', '', ''];
      const header4 = ["Comptage Fidélisation ", '', '', ''];
      const comptage_actif = [


        ['Tél fixe', result.STATS_AAA.A_P_M.AMA_FIXE_ACTIF_PM, result.STATS_AAA.A_P_M.OPD_FIXE_ACTIF_PM, result.STATS_AAA.A_P_M.TOTAL_FIXE_ACTIF_PM],
        ['Mobile', result.STATS_AAA.A_P_M.AMA_MOBI_ACTIF_PM, result.STATS_AAA.A_P_M.OPD_MOBI_ACTIF_PM, result.STATS_AAA.A_P_M.TOTAL_MOBI_ACTIF_PM],
        ['Total', result.STATS_AAA.A_P_M.TOTAL_TEL_AMA_ACTIF_PM, result.STATS_AAA.A_P_M.TOTAL_TEL_OPD_ACTIF_PM, result.STATS_AAA.TOTAL_ACTIF_PM],
      ]
      const comptage_actif2

        = [
          ['Tél fixe', result.STATS_AAA.A_P_F.AMA_FIXE_ACTIF_PF, result.STATS_AAA.A_P_F.OPD_FIXE_ACTIF_PF, result.STATS_AAA.A_P_F.TOTAL_FIXE_ACTIF_PF],
          ['Mobile', result.STATS_AAA.A_P_F.AMA_MOBI_ACTIF_PF, result.STATS_AAA.A_P_F.OPD_MOBI_ACTIF_PF, result.STATS_AAA.A_P_F.TOTAL_MOBI_ACTIF_PF],
          ['Total', result.STATS_AAA.A_P_F.TOTAL_TEL_AMA_ACTIF_PF, result.STATS_AAA.A_P_F.TOTAL_TEL_OPD_ACTIF_PF, result.STATS_AAA.TOTAL_ACTIF_PF],
        ]

      const comptage_fid = [


        ['Tél fixe', result.STATS_AAA.F_P_M.AMA_FIXE_FID_PM, result.STATS_AAA.F_P_M.OPD_FIXE_FID_PM, result.STATS_AAA.F_P_M.TOTAL_FIXE_FID_PM],
        ['Mobile', result.STATS_AAA.F_P_M.AMA_MOBI_FID_PM, result.STATS_AAA.F_P_M.OPD_MOBI_FID_PM, result.STATS_AAA.F_P_M.TOTAL_MOBI_FID_PM],
        ['Total', result.STATS_AAA.F_P_M.TOTAL_TEL_AMA_FID_PM, result.STATS_AAA.F_P_M.TOTAL_TEL_OPD_FID_PM, result.STATS_AAA.TOTAL_FID_PM],
      ]
      const comptage_fid2 = [


        ['Tél fixe', result.STATS_AAA.F_P_F.AMA_FIXE_FID_PF, result.STATS_AAA.F_P_F.OPD_FIXE_FID_PF, result.STATS_AAA.F_P_F.TOTAL_FIXE_FID_PF],
        ['Mobile', result.STATS_AAA.F_P_F.AMA_MOBI_FID_PF, result.STATS_AAA.F_P_F.OPD_MOBI_FID_PF, result.STATS_AAA.F_P_F.TOTAL_MOBI_FID_PF],
        ['Total', result.STATS_AAA.F_P_F.TOTAL_TEL_AMA_FID_PF, result.STATS_AAA.F_P_F.TOTAL_TEL_OPD_FID_PF, result.STATS_AAA.TOTAL_FID_PF],
      ]
      //Create workbook and worksheet
      let workbook = new ExcelJs.Workbook();
      // let workbook = new Workbook();
      let worksheet = workbook.addWorksheet('Audit');
      //Add Row and formatting
      let titleRow = worksheet.addRow([title]);
      titleRow.font = { name: 'Calibri', family: 4, size: 12, bold: true }
      titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.addRow([]);
      let subTitleRow = worksheet.addRow(['Date : ' + new Date().toISOString().slice(0, 10)])



      worksheet.mergeCells('A1:E2');
      //Blank Row
      worksheet.addRow([]);
      worksheet.addRow([]);


      stats_global.forEach(d => {
        let row = worksheet.addRow(d);
        row.eachCell((cell, number) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFFFF' },
            bgColor: { argb: '00000000' }
          }
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

        })
        row.getCell(3).alignment = { vertical: 'middle', horizontal: 'right' };


      }
      );
      worksheet.getColumn(1).width = 20;
      worksheet.getColumn(2).width = 10;
      worksheet.getColumn(3).width = 10;
      worksheet.addRow([]);
      worksheet.addRow([]);
      worksheet.addRow([]);
      worksheet.addRow(['*Opération de Conquete = Actif uniquement']);
      worksheet.addRow([]);
      worksheet.addRow([]);
      let header1Row = worksheet.addRow(header1);
      header1Row.eachCell((cell, number) => {
        cell.fill = {

          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFFFF' },
          bgColor: { argb: '00000000' }
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      })

      header1Row.font = { name: 'Calibri', family: 4, size: 11, bold: true }

      let header2Row = worksheet.addRow(header2);
      header2Row.eachCell((cell, number) => {
        cell.fill = {

          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFFFF' },
          bgColor: { argb: '00000000' }

        }

        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      })
      header2Row.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      }
      header2Row.font = { name: 'Calibri', family: 4, size: 10, bold: true }

      let headerRow = worksheet.addRow(header);
      headerRow.eachCell((cell, number) => {
        cell.fill = {

          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '5a85b3' },
          bgColor: { argb: '00000000' }

        }

        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

      })




      comptage_actif.forEach(d => {
        let row = worksheet.addRow(d);


        row.eachCell((cell, number) => {


          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFFFF' },
            bgColor: { argb: '00000000' }
          }
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        })

      }
      );

      worksheet.addRow([]);
      let header3Row = worksheet.addRow(header3);
      header3Row.eachCell((cell, number) => {
        cell.fill = {

          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFFFF' },
          bgColor: { argb: '00000000' }

        }

        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      })
      header3Row.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      }
      header3Row.font = { name: 'Calibri', family: 4, size: 10, bold: true }

      let headerRow_ = worksheet.addRow(header);
      headerRow_.eachCell((cell, number) => {
        cell.fill = {

          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '5a85b3' },
          bgColor: { argb: '00000000' }

        }

        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

      })
      comptage_actif2.forEach(d => {
        let row = worksheet.addRow(d);


        row.eachCell((cell, number) => {


          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFFFF' },
            bgColor: { argb: '00000000' }
          }
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        })

      }
      );

      worksheet.addRow([]);



      let header4Row = worksheet.addRow(header4);
      header4Row.eachCell((cell, number) => {
        cell.fill = {

          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFFFF' },
          bgColor: { argb: '00000000' }
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      })

      header4Row.font = { name: 'Calibri', family: 4, size: 11, bold: true }

      let header2Row_ = worksheet.addRow(header2);
      header2Row_.eachCell((cell, number) => {
        cell.fill = {

          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFFFF' },
          bgColor: { argb: '00000000' }

        }

        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      })
      header2Row_.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      }
      header2Row_.font = { name: 'Calibri', family: 4, size: 10, bold: true }

      let headerRow__ = worksheet.addRow(header);
      headerRow__.eachCell((cell, number) => {
        cell.fill = {

          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '5a85b3' },
          bgColor: { argb: '00000000' }

        }

        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

      })




      comptage_fid.forEach(d => {
        let row = worksheet.addRow(d);


        row.eachCell((cell, number) => {


          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFFFF' },
            bgColor: { argb: '00000000' }
          }
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        })

      }
      );

      worksheet.addRow([]);
      let header3Row_ = worksheet.addRow(header3);
      header3Row_.eachCell((cell, number) => {
        cell.fill = {

          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFFFF' },
          bgColor: { argb: '00000000' }

        }

        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      })
      header3Row_.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      }
      header3Row_.font = { name: 'Calibri', family: 4, size: 10, bold: true }

      let headerRow___ = worksheet.addRow(header);
      headerRow___.eachCell((cell, number) => {
        cell.fill = {

          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '5a85b3' },
          bgColor: { argb: '00000000' }

        }

        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

      })
      comptage_fid2.forEach(d => {
        let row = worksheet.addRow(d);


        row.eachCell((cell, number) => {


          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFFFF' },
            bgColor: { argb: '00000000' }
          }
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        })

      }
      );











      worksheet.mergeCells('A21:D21');
      worksheet.mergeCells('A34:D34');



      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, title + '.xlsx');
      })

    }
    if (media === 'email') {

      const stats_global = [
        ['Lignes en entrée', result.Lignes_en_entree],
        ['Valide RNVP', result.Valide_RNVP, result.Valide_RNVPPercent + " %"],
        ['Personnes avec Email', result.Personnes_avec_Email, result.Personnes_avec_EmailPercent + " %"],

      ]

      //Create workbook and worksheet
      let workbook = new ExcelJs.Workbook();
      // let workbook = new Workbook();
      let worksheet = workbook.addWorksheet('Audit');
      //Add Row and formatting
      let titleRow = worksheet.addRow([title]);
      titleRow.font = { name: 'Calibri', family: 4, size: 12, bold: true }
      titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.addRow([]);
      worksheet.addRow(['Date : ' + new Date().toISOString().slice(0, 10)])



      worksheet.mergeCells('A1:E2');
      //Blank Row
      worksheet.addRow([]);
      worksheet.addRow([]);


      stats_global.forEach(d => {
        let row = worksheet.addRow(d);
        row.eachCell((cell, number) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFFFF' },
            bgColor: { argb: '00000000' }
          }
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

        })
        row.getCell(3).alignment = { vertical: 'middle', horizontal: 'right' };


      }
      );
      worksheet.getColumn(1).width = 20;
      worksheet.getColumn(2).width = 10;
      worksheet.getColumn(3).width = 10;
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, title + '.xlsx');
      })


    }
  }
}
