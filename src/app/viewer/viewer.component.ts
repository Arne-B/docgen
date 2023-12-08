import { Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './viewer.component.html',
  styleUrl: './viewer.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ViewerComponent {

  /**
   *
   */
  constructor(private sanitizer: DomSanitizer) {
    this.safeContent = this.preparePreview(this._content ?? '');
    this.insertModel();

    document.addEventListener("input", e => {
      const target = (e?.target as HTMLElement)?.closest(".preview-viewer-edit");
      if(target){
        this.updateModel();
      }
    });
  }
  safeContent: SafeHtml;

  _content: string | undefined;

  @Input()
  set content(val: string | undefined) {
    this._content = val;
    this.safeContent = this.preparePreview(this._content ?? '');
    this.insertModel();
  }

  get content() {
    return this._content;
  }

  private createInput(key: string, value: string) {
    return `<span data-inputname="${key}" class="preview-viewer-edit" contenteditable="true" role="textbox">${value}</span>`;
  }


  private preparePreview(content: string) {
    console.log('prepare', content);
    content = content.replaceAll(/\[\[(\w+)\]\]/g, (_, g1) => this.createInput(g1, (this._model?.[g1]) ?? ' '));
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  _model:any;

  @Input()
  set model(val:any) {
    this._model = val;
    this.modelChange.emit(this._model);
    if(this._model) {
      window.setTimeout(() => // ugly hack to wait for innerHtml binding, use mutations observers instea
      this.insertModel(), 100);
    }
  }
  
  get model():any {
    return this._model;
  }

  @Output()
  modelChange = new EventEmitter<any>();

  private updateModel() {
    
    const elements = document.querySelectorAll(`[data-inputname]`);
    console.log('get', elements?.length);
    elements.forEach(el => {
      const key = el.getAttribute('data-inputname');
      const value = el.innerHTML;
      if(key && value != undefined) {
        this._model[key] = value;
      }
    });

    this.modelChange.emit(this._model);
  }

  private insertModel() {
    console.log('insert', this._model);
    if(!this._model) return;
    for(let key of Object.keys(this._model)) {
      const el = document.querySelector(`[data-inputname="${key}"]`);
      console.log('el', el);
      if(el) el.innerHTML = this._model[key];
    }
  }

  get textModel() {
    return JSON.stringify(this.model);
  }

  set textModel(val: string) {
    this.model = JSON.parse(val);
  }
}
 