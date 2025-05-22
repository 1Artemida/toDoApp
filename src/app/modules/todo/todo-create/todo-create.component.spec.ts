import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoCreateComponent } from './todo-create.component';
import { By } from '@angular/platform-browser';

describe('TodoCreateComponent', () => {
  let component: TodoCreateComponent;
  let fixture: ComponentFixture<TodoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoCreateComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TodoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the task when addTask is called with a valid task', () => {
    spyOn(component.onAddTask, 'emit');

    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'New Todo';

    component.addTask(input);

    expect(component.onAddTask.emit).toHaveBeenCalledWith('New Todo');
    expect(input.value).toBe('');
  });

  it('should not emit the task if the input is empty or only whitespace', () => {
    spyOn(component.onAddTask, 'emit');

    const input = fixture.debugElement.query(By.css('input')).nativeElement;

    input.value = '';
    component.addTask(input);
    expect(component.onAddTask.emit).not.toHaveBeenCalled();

    input.value = '   ';
    component.addTask(input);
    expect(component.onAddTask.emit).not.toHaveBeenCalled();
  });

  it('should emit the task when "Enter" is pressed', () => {
    spyOn(component.onAddTask, 'emit');

    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'Enter';

    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));

    expect(component.onAddTask.emit).toHaveBeenCalledWith('Enter');
    expect(input.value).toBe('');
  });
});
