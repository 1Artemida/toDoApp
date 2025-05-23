import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { Task, TaskStatus } from '../todo.interfaces';
import { provideHttpClientTesting } from '@angular/common/http/testing';

const sampleTasks: Task[] = [
  { id: 1, title: 'Task 1', completed: false, status: TaskStatus.low },
  { id: 2, title: 'Task 2', completed: true, status: TaskStatus.high },
];

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    component.tasks = [...sampleTasks];
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit onToggleTask with correct values', () => {
    spyOn(component.onToggleTask, 'emit');
    const mockEvent = { target: { checked: true } } as unknown as Event;
    component.toggleTask(sampleTasks[0], mockEvent);
    expect(component.onToggleTask.emit).toHaveBeenCalledWith({
      id: 1,
      completed: true,
    });
  });

  it('should emit onEditTask if task is editable and new title is different', () => {
    spyOn(window, 'prompt').and.returnValue('Updated Task 1');
    spyOn(component.onEditTask, 'emit');
    component.editTask(sampleTasks[0]);
    expect(component.onEditTask.emit).toHaveBeenCalledWith({
      id: 1,
      newTitle: 'Updated Task 1',
    });
  });

  it('should not emit onEditTask if task is completed', () => {
    spyOn(component.onEditTask, 'emit');
    component.editTask(sampleTasks[1]);
    expect(component.onEditTask.emit).not.toHaveBeenCalled();
  });

  it('should emit onStatusChange on handleStatusChange', () => {
    spyOn(component.onStatusChange, 'emit');
    const event = { target: { value: TaskStatus.medium } } as unknown as Event;
    component.handleStatusChange(1, event);
    expect(component.onStatusChange.emit).toHaveBeenCalledWith({
      id: 1,
      status: TaskStatus.medium,
    });
  });

  it('should emit onClearCompleted when clearCompleted is called', () => {
    spyOn(component.onClearCompleted, 'emit');
    component.clearCompleted();
    expect(component.onClearCompleted.emit).toHaveBeenCalled();
  });

  it('should not emit status change if status is the same', () => {
    spyOn(component.onStatusChange, 'emit');
    component.changeStatus(sampleTasks[0], TaskStatus.low);
    expect(component.onStatusChange.emit).not.toHaveBeenCalled();
  });

  it('should emit status change if status is different', () => {
    spyOn(component.onStatusChange, 'emit');
    component.changeStatus(sampleTasks[0], TaskStatus.high);
    expect(component.onStatusChange.emit).toHaveBeenCalledWith({
      id: 1,
      status: TaskStatus.high,
    });
  });
});
