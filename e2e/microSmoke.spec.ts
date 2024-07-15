import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

const TODO_ITEMS = [
  'buy some cheese',
  'feed the cat',
  'book a doctors appointment'
] as const;

test.describe('New Todo', () => {
  test('should allow me to add todo items', async ({ page }) => {
    const newTodo = page.getByPlaceholder('Add a new task');
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');
    await expect(page.getByTestId('todo-title')).toHaveText([
      TODO_ITEMS[0],
      TODO_ITEMS[1]
    ]);
  });

  test('should clear text input field when an item is added', async ({ page }) => {
    const newTodo = page.getByPlaceholder('Add a new task');
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');
    await expect(newTodo).toBeEmpty();
  });

  test('should append new items to the bottom of the list', async ({ page }) => {
    await createDefaultTodos(page);
    const todoCount = page.getByTestId('todo-count')
    await expect(page.getByText('3 tasks left')).toBeVisible();
    await expect(todoCount).toHaveText('3 tasks left');
    await expect(page.getByTestId('todo-title')).toHaveText(TODO_ITEMS);
  });
});

test.describe('Item', () => {
  test('should allow me to mark items as complete', async ({ page }) => {
    const newTodo = page.getByPlaceholder('Add a new task');
    for (const item of TODO_ITEMS.slice(0, 2)) {
      await newTodo.fill(item);
      await newTodo.press('Enter');
    }
    const firstTodo = page.getByTestId('todo-title').nth(0);
    await page.getByTestId('todo-item').locator('span').nth(0).click();
    await expect(firstTodo).toHaveClass(/todo__list_completeItem*/);
    const secondTodo = page.getByTestId('todo-title').nth(1);
    await expect(secondTodo).not.toHaveClass(/todo__list_completeItem*/);
    await page.getByTestId('todo-item').locator('span').nth(1).click();
    await expect(firstTodo).toHaveClass(/todo__list_completeItem*/);
    await expect(secondTodo).toHaveClass(/todo__list_completeItem*/);
  });

  test('should allow me to un-mark items as complete', async ({ page }) => {
    const newTodo = page.getByPlaceholder('Add a new task');
    for (const item of TODO_ITEMS.slice(0, 2)) {
      await newTodo.fill(item);
      await newTodo.press('Enter');
    }
    const firstTodo = page.getByTestId('todo-title').nth(0);
    const secondTodo = page.getByTestId('todo-title').nth(1);

    await page.getByTestId('todo-item').locator('span').nth(0).click();
    await expect(firstTodo).toHaveClass(/todo__list_completeItem*/);
    await expect(secondTodo).not.toHaveClass(/todo__list_completeItem*/);

    await page.getByTestId('todo-item').locator('span').nth(0).click();
    await expect(firstTodo).not.toHaveClass(/todo__list_completeItem*/);
    await expect(secondTodo).not.toHaveClass(/todo__list_completeItem*/);
  });
});

test.describe('Counter', () => {
  test('should display the current number of todo items', async ({ page }) => {
    const newTodo = page.getByPlaceholder('Add a new task');
    const todoCount = page.getByTestId('todo-count')
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');
    await expect(todoCount).toContainText('1');
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');
    await expect(todoCount).toContainText('2');
  });
});

test.describe('Clear completed button', () => {
  test.beforeEach(async ({ page }) => {
    await createDefaultTodos(page);
  });

  test('should remove completed items when clicked', async ({ page }) => {
    const todoItems = page.getByTestId('todo-item');
    await page.getByTestId('todo-item').locator('span').nth(1).click();
    await page.getByRole('button', { name: 'Clear completed' }).click();
    await expect(todoItems).toHaveCount(2);
    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });

  test('should be hidden when there are no items that are completed', async ({ page }) => {
    await page.getByTestId('todo-item').locator('span').nth(0).click();
    await page.getByRole('button', { name: 'Clear completed' }).click();
    await expect(page.getByRole('button', { name: 'Clear completed' })).toBeDisabled();
  });
});

async function createDefaultTodos(page: Page) {
  const newTodo = page.getByPlaceholder('Add a new task');

  for (const item of TODO_ITEMS) {
    await newTodo.fill(item);
    await newTodo.press('Enter');
  }
}

