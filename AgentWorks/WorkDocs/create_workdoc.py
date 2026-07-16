#!/usr/bin/env python3

from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent
WORK_TYPES = ("cooperation", "bugfix")
TAGS_README = ROOT / "tags" / "README.md"
WORK_ROOT_TEMPLATE = ROOT / "templates" / "work-root"
TODO_TEMPLATE = ROOT / "templates" / "todo"
TODO_PLACEHOLDER = "TODO_01_첫번째_TODO_이름으로_교체"


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


def parse_tags(raw_tags: str) -> list[str]:
    return [tag.strip() for tag in raw_tags.split(",") if tag.strip()]


def validate_path_name(value: str, label: str) -> None:
    if not value.strip():
        raise ValueError(f"{label} 값이 비어 있습니다.")
    if value in {".", ".."}:
        raise ValueError(f"{label} 값으로 '{value}'는 사용할 수 없습니다.")
    if "/" in value or "\\" in value:
        raise ValueError(f"{label} 값에는 경로 구분자를 넣을 수 없습니다: {value}")


def normalize_todo_name(todo_name: str) -> str:
    validate_path_name(todo_name, "todo_name")
    if todo_name.startswith("TODO_"):
        return todo_name
    return f"TODO_01_{todo_name}"


def default_title_from_name(work_name: str) -> str:
    return work_name.replace("_", " ").replace("-", " ").strip()


def ensure_tags_defined(tags: list[str], allow_undefined_tags: bool) -> None:
    standard_tags = load_standard_tags(TAGS_README)
    standard_tag_set = set(standard_tags)
    missing = [tag for tag in tags if tag not in standard_tag_set]

    if not missing:
        return

    if allow_undefined_tags:
        return

    if not standard_tags:
        raise ValueError(
            "tags/README.md에 정의된 표준 태그가 없습니다. "
            "작업 루트를 만들기 전에 프로젝트 태그를 먼저 추가하세요."
        )

    raise ValueError(
        "정의되지 않은 태그가 있습니다: "
        f"{', '.join(missing)}. "
        "tags/README.md에 먼저 태그를 정의하거나 올바른 표준 태그를 사용하세요."
    )


def copy_template(src: Path, dst: Path, dry_run: bool) -> None:
    if src.exists() is False:
        raise FileNotFoundError(f"템플릿을 찾지 못했습니다: {src}")
    if dst.exists():
        raise FileExistsError(f"이미 존재하는 경로입니다: {dst}")
    if dry_run:
        return
    shutil.copytree(src, dst)


def write_text(path: Path, content: str, dry_run: bool) -> None:
    if dry_run:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def replace_in_file(path: Path, old_text: str, new_text: str, dry_run: bool) -> None:
    if dry_run:
        return
    content = path.read_text(encoding="utf-8")
    path.write_text(content.replace(old_text, new_text), encoding="utf-8")


def render_meta(
    title: str,
    category: str,
    tags: list[str],
    origin: str | None,
    status: str,
) -> str:
    lines = [
        "# Meta",
        "",
        f"Title: {title}",
        f"Type: {category}",
        f"Tags: {', '.join(tags)}",
    ]
    if origin:
        lines.append(f"Origin: {origin}")
    lines.append(f"Status: {status}")
    return "\n".join(lines) + "\n"


def render_readme(title: str) -> str:
    return "\n".join(
        [
            f"# {title}",
            "",
            "## Summary",
            "- 작업 요약을 적는다.",
            "",
            "## Background",
            "- 다른 에이전트가 이어서 작업할 때 필요한 배경을 적는다.",
            "",
            "## Scope",
            "- 이번 작업의 범위를 적는다.",
            "",
            "## References",
            "- 관련 파일, 문서, 이슈, planning 문서를 연결한다.",
            "",
            "## Current Status",
            "- 최신 상위 상태를 적는다.",
            "",
        ]
    )


def render_root_todo(todo_name: str) -> str:
    return "\n".join(
        [
            "# TODO",
            "",
            f"- [ ] {todo_name}",
            "",
            "Current Focus:",
            f"- {todo_name}",
            "",
        ]
    )


def create_workdoc(args: argparse.Namespace) -> int:
    validate_path_name(args.work_name, "work_name")
    todo_name = normalize_todo_name(args.todo)
    title = args.title or default_title_from_name(args.work_name)
    tags = parse_tags(args.tags)
    if not tags:
        raise ValueError("--tags 값은 비워둘 수 없습니다.")
    ensure_tags_defined(tags, args.allow_undefined_tags)

    category_dir = ROOT / args.category
    work_root = category_dir / args.work_name
    todo_dir = work_root / todo_name

    print(f"작업 루트 생성: {work_root.relative_to(ROOT)}")
    print(f"첫 TODO 생성: {todo_dir.relative_to(ROOT)}")
    if args.dry_run:
        return 0

    category_dir.mkdir(parents=True, exist_ok=True)
    copy_template(WORK_ROOT_TEMPLATE, work_root, dry_run=False)
    copy_template(TODO_TEMPLATE, todo_dir, dry_run=False)

    write_text(
        work_root / "Meta.md",
        render_meta(
            title=title,
            category=args.category,
            tags=tags,
            origin=args.origin,
            status=args.status,
        ),
        dry_run=False,
    )
    write_text(work_root / "README.md", render_readme(title), dry_run=False)
    write_text(work_root / "TODO.md", render_root_todo(todo_name), dry_run=False)
    replace_in_file(
        todo_dir / "review" / "README.md",
        TODO_PLACEHOLDER,
        todo_name,
        dry_run=False,
    )
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="WorkDocs 작업 루트와 첫 TODO 폴더를 생성한다."
    )
    parser.add_argument("category", choices=WORK_TYPES, help="작업 타입")
    parser.add_argument("work_name", help="생성할 작업 루트 폴더 이름")
    parser.add_argument(
        "--title",
        help="Meta.md와 README.md에 기록할 작업 제목. 생략하면 work_name에서 만든다.",
    )
    parser.add_argument(
        "--tags",
        required=True,
        help="쉼표로 구분한 표준 태그 목록. 예: auth,editor",
    )
    parser.add_argument(
        "--todo",
        default="TODO_01_Initial",
        help="첫 TODO 폴더 이름. TODO_로 시작하지 않으면 TODO_01_ 접두사를 붙인다.",
    )
    parser.add_argument(
        "--origin",
        help="관련 원작업이 있을 때 Meta.md의 Origin에 기록할 값",
    )
    parser.add_argument(
        "--status",
        default="in_progress",
        help="Meta.md의 Status 값. 기본값: in_progress",
    )
    parser.add_argument(
        "--allow-undefined-tags",
        action="store_true",
        help="tags/README.md에 없는 태그도 허용한다. 일반적으로 권장하지 않는다.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="실제 파일을 만들지 않고 생성 예정 경로만 출력한다.",
    )
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    try:
        return create_workdoc(args)
    except Exception as exc:
        print(f"생성 실패: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
