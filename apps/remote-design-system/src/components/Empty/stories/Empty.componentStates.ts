import { defineDsCascader } from "../../Cascader";
import { defineDsSelect } from "../../Select";
import { defineDsTransfer } from "../../Transfer";
import { defineDsTreeSelect } from "../../TreeSelect";
import { defineDsEmpty } from "..";
import { createCompactEmpty, createComponentCase, createFrame, createGrid } from "./Empty.storyDom";

const EMPTY_TEXT = "Data Not Found";

export function renderComponentEmptyStates() {
  ensureComponentEmptyStatesDefined();

  return createFrame(
    [
      createGrid([
        createComponentCase("Select", createEmptySelect()),
        createComponentCase("TreeSelect", createEmptyTreeSelect()),
        createComponentCase("Cascader", createEmptyCascader()),
        createComponentCase("Transfer", createEmptyTransfer(), "ds-empty-story-component--transfer"),
        createComponentCase("Table", createTableEmpty()),
        createComponentCase("List", createListEmpty())
      ])
    ],
    "ds-empty-story-frame--wide"
  );
}

function ensureComponentEmptyStatesDefined() {
  defineDsEmpty();
  defineDsSelect();
  defineDsTreeSelect();
  defineDsCascader();
  defineDsTransfer();
}

function createTableEmpty() {
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const headerRow = document.createElement("tr");
  const emptyRow = document.createElement("tr");
  const emptyCell = document.createElement("td");

  table.className = "ds-empty-story-table";

  for (const label of ["Name", "Age"]) {
    const cell = document.createElement("th");

    cell.textContent = label;
    headerRow.append(cell);
  }

  emptyCell.colSpan = 2;
  emptyCell.append(createCompactEmpty(EMPTY_TEXT));
  emptyRow.append(emptyCell);
  thead.append(headerRow);
  tbody.append(emptyRow);
  table.append(thead, tbody);

  return table;
}

function createEmptySelect() {
  const select = document.createElement("ds-select");

  select.className = "ds-empty-story-control";
  select.setAttribute("not-found-content", EMPTY_TEXT);
  select.setAttribute("open", "true");
  select.setAttribute("options", "[]");
  select.setAttribute("placeholder", "Please select");

  return select;
}

function createEmptyTreeSelect() {
  const treeSelect = document.createElement("ds-tree-select");

  treeSelect.className = "ds-empty-story-control";
  treeSelect.setAttribute("open", "true");
  treeSelect.setAttribute("placeholder", "Please select");
  treeSelect.setAttribute("tree-data", "[]");

  return treeSelect;
}

function createEmptyCascader() {
  const cascader = document.createElement("ds-cascader");

  cascader.className = "ds-empty-story-control";
  cascader.setAttribute("not-found-content", EMPTY_TEXT);
  cascader.setAttribute("open", "true");
  cascader.setAttribute("options", "[]");
  cascader.setAttribute("placeholder", "Please select");

  return cascader;
}

function createEmptyTransfer() {
  const transfer = document.createElement("ds-transfer");

  transfer.className = "ds-empty-story-transfer-control";
  transfer.setAttribute("data-source", "[]");
  transfer.setAttribute("show-select-all", "true");
  transfer.setAttribute("target-keys", "");
  transfer.setAttribute("titles", "Source,Target");

  return transfer;
}

function createListEmpty() {
  const list = document.createElement("div");

  list.className = "ds-empty-story-list";
  list.append(createCompactEmpty(EMPTY_TEXT));

  return list;
}
