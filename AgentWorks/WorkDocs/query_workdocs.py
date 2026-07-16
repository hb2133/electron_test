#!/usr/bin/env python3

from __future__ import annotations

import argparse
import sys
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parent
WORK_TYPES = ("cooperation", "bugfix")
TAGS_README = ROOT / "tags" / "README.md"


@dataclass
class WorkItem:
    category: str
    name: str
    path: Path
    title: str | None
    meta_type: str | None
    tags: list[str]
    origin: str | None
    status: str | None
    invalid_tags: list[str]


def load_standard_tags(path: Path) -> list[str]:
    if not path.exists():
        return []

    tags: list[str] = []
    in_fenced_code = False
    for line in path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if stripped.startswith("```"):
            in_fenced_code = not in_fenced_code
            continue
        if in_fenced_code:
            continue
        if stripped.startswith("## "):
            tag = stripped[3:].strip()
            if tag:
                tags.append(tag)
    return tags


def parse_meta(meta_path: Path) -> dict[str, str]:
    data: dict[str, str] = {}
    for line in meta_path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or ":" not in stripped:
            continue
        key, value = stripped.split(":", 1)
        key = key.strip()
        value = value.strip()
        if key:
            data[key] = value
    return data


def parse_tags(raw_tags: str | None) -> list[str]:
    if not raw_tags:
        return []
    return [tag.strip() for tag in raw_tags.split(",") if tag.strip()]


def iter_work_roots(root: Path) -> list[tuple[str, Path]]:
    roots: list[tuple[str, Path]] = []
    for category in WORK_TYPES:
        category_dir = root / category
        if not category_dir.exists():
            continue
        for child in sorted(category_dir.iterdir()):
            if child.is_dir():
                roots.append((category, child))
    return roots


def load_work_items(root: Path) -> tuple[list[WorkItem], list[str], list[str]]:
    standard_tags = load_standard_tags(TAGS_README)
    standard_tag_set = set(standard_tags)

    items: list[WorkItem] = []
    warnings: list[str] = []

    for category, work_root in iter_work_roots(root):
        meta_path = work_root / "Meta.md"
        if not meta_path.exists():
            warnings.append(f"Meta.md missing: {work_root.relative_to(root)}")
            continue

        meta = parse_meta(meta_path)
        tags = parse_tags(meta.get("Tags"))
        invalid_tags = [tag for tag in tags if tag not in standard_tag_set]

        items.append(
            WorkItem(
                category=category,
                name=work_root.name,
                path=work_root,
                title=meta.get("Title"),
                meta_type=meta.get("Type"),
                tags=tags,
                origin=meta.get("Origin"),
                status=meta.get("Status"),
                invalid_tags=invalid_tags,
            )
        )

    items.sort(key=lambda item: (item.category, item.name))
    return items, standard_tags, warnings


def format_item(item: WorkItem, root: Path) -> str:
    rel_path = item.path.relative_to(root)
    parts = [
        f"- {item.name}",
        f"  path: {rel_path}",
        f"  category: {item.category}",
        f"  title: {item.title or '-'}",
        f"  type: {item.meta_type or '-'}",
        f"  status: {item.status or '-'}",
        f"  tags: {', '.join(item.tags) if item.tags else '-'}",
    ]
    if item.origin:
        parts.append(f"  origin: {item.origin}")
    if item.invalid_tags:
        parts.append(f"  invalid_tags: {', '.join(item.invalid_tags)}")
    return "\n".join(parts)


def print_items(items: list[WorkItem], root: Path) -> None:
    if not items:
        print("조건에 맞는 작업 루트가 없습니다.")
        return

    for item in items:
        print(format_item(item, root))


def command_list(items: list[WorkItem], root: Path) -> int:
    print_items(items, root)
    return 0


def command_list_tags(items: list[WorkItem], standard_tags: list[str]) -> int:
    usage: dict[str, int] = {tag: 0 for tag in standard_tags}
    for item in items:
        for tag in item.tags:
            if tag in usage:
                usage[tag] += 1

    if not standard_tags:
        print("tags/README.md에 정의된 표준 태그가 없습니다.")
        return 1

    for tag in standard_tags:
        print(f"- {tag}: {usage[tag]}")
    return 0


def command_find_tag(items: list[WorkItem], root: Path, tag: str) -> int:
    matched = [item for item in items if tag in item.tags]
    print(f"태그: {tag}")
    print_items(matched, root)
    return 0 if matched else 1


def command_related(items: list[WorkItem], root: Path, work_name: str) -> int:
    target = next((item for item in items if item.name == work_name), None)
    if target is None:
        print(f"작업 루트를 찾지 못했습니다: {work_name}")
        return 1

    target_tags = set(target.tags)
    related: list[tuple[WorkItem, list[str]]] = []
    for item in items:
        if item.name == target.name:
            continue
        shared = sorted(target_tags.intersection(item.tags))
        if shared:
            related.append((item, shared))

    print("대상")
    print(format_item(target, root))
    print("")
    print("관련 작업")

    if not related:
        print("관련 작업 루트가 없습니다.")
        return 0

    for item, shared in related:
        print(format_item(item, root))
        print(f"  shared_tags: {', '.join(shared)}")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="표준 태그와 공유 태그 관계를 기준으로 WorkDocs 작업 루트를 조회한다."
    )
    subparsers = parser.add_subparsers(dest="command")

    subparsers.add_parser("list", help="인덱싱된 작업 루트를 나열한다.")
    subparsers.add_parser("list-tags", help="표준 태그와 사용 횟수를 나열한다.")

    tag_parser = subparsers.add_parser("tag", help="태그로 작업 루트를 찾는다.")
    tag_parser.add_argument("tag", help="tags/README.md에 정의된 표준 태그 이름")

    related_parser = subparsers.add_parser(
        "related", help="공유 태그가 있는 관련 작업 루트를 찾는다."
    )
    related_parser.add_argument("work_name", help="작업 루트 폴더 이름")

    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    command = args.command or "list"
    items, standard_tags, warnings = load_work_items(ROOT)

    if warnings:
        print("경고:", file=sys.stderr)
        for warning in warnings:
            print(f"- {warning}", file=sys.stderr)

    if command == "list":
        return command_list(items, ROOT)
    if command == "list-tags":
        return command_list_tags(items, standard_tags)
    if command == "tag":
        return command_find_tag(items, ROOT, args.tag)
    if command == "related":
        return command_related(items, ROOT, args.work_name)

    parser.print_help()
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
