import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewerComponent } from '../viewer/viewer.component';
import { CKEditorComponent, CKEditorModule } from '@ckeditor/ckeditor5-angular';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-creator',
  standalone: true,
  imports: [CommonModule, CKEditorModule, FormsModule, ViewerComponent], 
  templateUrl: './creator.component.html',
  styleUrl: './creator.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CreatorComponent implements AfterViewInit {
  async ngAfterViewInit() {
    this.editor = await DecoupledEditor.create(this.page.nativeElement);
    this.editor.setData(this.value);
    this.tools.nativeElement.appendChild( this.editor.ui.view.toolbar.element );
    this.editor.model.document.on( 'change:data', () => {
      this.value = this.editor?.getData() ?? '';
    });
    
  }

  @ViewChild( 'page' ) page!: ElementRef;
  @ViewChild( 'tools' ) tools!: ElementRef;

  editor: DecoupledEditor | undefined;

  value:string = '<p>Hallo [[name]] ([[age]])!</p>';
  _model:any = {name:'Bob the Builder', age:'6'};

  set model(val:any) {
    this._model = val;
    console.log(val);
  }

  get model() {
    return this._model;
  }

  log(val:any) {
    console.log(val);
  }
}
