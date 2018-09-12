import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { DialogCreateMatrixComponent } from '../dialog-create-matrix/dialog-create-matrix.component';
import { DialogChanceSetComponent } from '../dialog-set-chance/dialog-set-chance.component';
import { MatrixLength, MatrixItem, Domain, DomainItem } from '../model/matrix.model';

interface ItemTable {
  chance: number;
  countDomains: number;
  matrixLength: MatrixLength;
}

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard-html.component.html',
  styleUrls: ['./dashboard-scss.component.scss']
})
export class DashboardComponent implements OnInit {
  matrix: MatrixItem[][];
  matrixLength: MatrixLength;
  chance: number;
  countDomains: number;
  displayedColumns = ['chance', 'countDomains', 'matrixLength'];
  dataSource = new MatTableDataSource<ItemTable>();
  table: ItemTable[];

  constructor(
    public dialog: MatDialog,
  ) {    
  }
  ngOnInit() {
    setTimeout(() => {
      this.openDialogCreateMatrix();  
    });
  }
  createMatrix(n: number, m: number) {
    this.matrix = [];
    for (let iN = 0; iN < n; ++iN) {
      this.matrix[iN] = [];
      for (let iM = 0; iM < m; ++iM) {
        this.matrix[iN][iM] = {
          value: 0,
          domain: null,
        };
      }
    }
  }
  openDialogCreateMatrix() {
    let dialogRef = this.dialog.open(DialogCreateMatrixComponent, {data: {matrixLength: this.matrixLength}});
    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe((result: MatrixLength) => {
      if (result) {
        this.matrixLength = result;
        this.createMatrix(result.n, result.m);
      }
    });
  }
  getRandom(): number {
    let num = Math.random();
    if (this.chance && num > 0 && num <= this.chance) {
      return 1;
    }
    return 0;
  }
  changeValueMatrix(n: number, m: number) {
    if (this.matrix[n][m].value === 1) {
      this.matrix[n][m].value = 0;
    } else {
      this.matrix[n][m].value = 1;
    }
    this.calcDomains();
  }
  openDialogSetChance() {
    let dialogRef = this.dialog.open(DialogChanceSetComponent);
    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe((result: number) => {
      if (result) {
        this.chance = result;
        this.setAutoValueInMatrix();
      }
    });
  }
  setAutoValueInMatrix() {
    for (let iN = 0; iN < this.matrix.length; ++iN) {
      for (let iM = 0; iM < this.matrix[iN].length; ++iM) {
        this.matrix[iN][iM].value = this.getRandom();
        this.matrix[iN][iM].domain = null;
      }
    }
  }
  calcDomainsAndAddInResult() {
    this.calcDomains();
    this.addInResult();
  }
  calcDomains() {
    this.countDomains = 0;
    let arrayDomains: DomainItem[][] = [];
    for (let iN = 0; iN < this.matrix.length; ++iN) {
      for (let iM = 0; iM < this.matrix[iN].length; ++iM) {
        if (this.matrix[iN][iM].value === 0) {
          this.matrix[iN][iM].domain = null;
          continue;
        } 
        let suitableSomain: DomainItem[];
        for (let a = 0; a < arrayDomains.length; ++a) {
          for (let i = 0; i < arrayDomains[a].length; ++i) {
            if (iN === arrayDomains[a][i].n && (iM - 1 === arrayDomains[a][i].m || iM + 1 === arrayDomains[a][i].m) || iM === arrayDomains[a][i].m && (iN - 1 === arrayDomains[a][i].n || iN + 1 === arrayDomains[a][i].n)) {
              suitableSomain = arrayDomains[a];
              break;
            }
          }
          if (suitableSomain) {
            break;
          }
        }
        if (suitableSomain) {
          suitableSomain.push({n: iN, m: iM});
          this.matrix[iN][iM].domain = this.matrix[suitableSomain[0].n][suitableSomain[0].m].domain;
        } else {
          arrayDomains.push([{n: iN, m: iM}]);
          this.matrix[iN][iM].domain = { color: this.getRandomColor() };
        }
      }
    }
    arrayDomains = this.unionDomains(arrayDomains);
    for (let i = 0; i < arrayDomains.length; ++i) {
      if (arrayDomains[i].length > 0) {
        this.countDomains++;  
      }
    }
  }    	
  unionDomains(arrayDomains: DomainItem[][]): DomainItem[][] {
    let repeat;
    for (let a = 0; a < arrayDomains.length; ++a) {
      for (let i = 0; i < arrayDomains[a].length; ++i) {
        const findIndexDomain =
          this.findIndexDomain(arrayDomains, a, {n: arrayDomains[a][i].n - 1, m: arrayDomains[a][i].m}) || 
          this.findIndexDomain(arrayDomains, a,  {n: arrayDomains[a][i].n, m: arrayDomains[a][i].m - 1}) || 
          this.findIndexDomain(arrayDomains, a, {n: arrayDomains[a][i].n + 1, m: arrayDomains[a][i].m}) || 
          this.findIndexDomain(arrayDomains, a, {n: arrayDomains[a][i].n, m: arrayDomains[a][i].m + 1});
        if (findIndexDomain !== null && findIndexDomain != a) {
          const deletedDomain = arrayDomains[a];
          arrayDomains[findIndexDomain].push(...deletedDomain);          
          for (let d = 0; d < deletedDomain.length; ++d) {
            this.matrix[deletedDomain[d].n][deletedDomain[d].m].domain = this.matrix[arrayDomains[findIndexDomain][0].n][arrayDomains[findIndexDomain][0].m].domain;
          }
          arrayDomains[a] = [];
          repeat = true;
          break;
        }
      }
    }
    if (repeat) {
      arrayDomains = this.unionDomains(arrayDomains);
    }
    return arrayDomains;
  }
  findIndexDomain(arrayDomains: DomainItem[][], curentDomen: number, item: DomainItem): number {
    for (let a = 0; a < arrayDomains.length; ++a) {
      if (a === curentDomen) {
        continue;
      }
      for (let i = 0; i < arrayDomains[a].length; ++i) {
        if (item.n === arrayDomains[a][i].n && item.m === arrayDomains[a][i].m) {
          return a;
        }
      }
    }
    return null;
  }
  addInResult() {
    if (!this.table) {
      this.table = [];
    }
    if (this.table.length > 9) {
      this.table.splice(0, 1);
    }
    this.table.push({
      chance: this.chance,
      countDomains: this.countDomains,
      matrixLength: this.matrixLength
    })
    this.dataSource.data = this.table;
  }
  getRandomColor(): string {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
