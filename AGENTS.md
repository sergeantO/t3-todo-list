# Agent Instructions

В этом проекте для отслеживания задач используется **bd** (beads). Для начала работы запусти `bd onboard`.

Используй 'bd' для отслеживания задач

## Краткий справочник

```bash
bd ready # Найти доступную работу
bd show <id> # Просмотреть подробности задачи
bd update <id> --status in_progress # Занять работу
bd close <id> # Завершить работу
bd sync # Синхронизировать с git
```

## Завершение работы (Сессия)

**При завершении рабочей сессии** необходимо выполнить ВСЕ описанные ниже шаги. Работа НЕ считается завершенной, пока не будет успешно выполнена команда `git push`.

**ОБЯЗАТЕЛЬНЫЙ РАБОЧИЙ ПРОЦЕСС:**

1. **Создание задач для оставшейся работы** - Создавай задачи для всего, что требует дальнейшего выполнения.
2. **Проверка качества** (если код изменился) - Тесты, линтеры, сборки.
3. **Обновление статуса задачи** - Закрытие завершенной работы, обновление незавершенных элементов.
4. **ОТПРАВКА НА УДАЛЕННЫЙ РЕПОЗИТОРИЙ** - Это ОБЯЗАТЕЛЬНО:
```bash
git pull --rebase
bd sync
git push
git status # ДОЛЖНО показывать "up to date with origin"
```
5. **Очистка** - Очистка stash-файлов, удаление удаленных веток.
6. **Проверка** - Все изменения зафиксированы и отправлены.
7. **Передача** - Предоставление контекста для следующей сессии.

**КРИТИЧЕСКИ ВАЖНЫЕ ПРАВИЛА:**
- Работа НЕ считается завершенной, пока команда `git push` не будет успешно выполнена.
- НИКОГДА не останавливайтесь до отправки изменений - это оставляет работу незавершенной локально.
- НИКОГДА не говори "готово к отправке" - ТЫ должен отправить запрос
- Если отправка запроса не удалась, устрани проблему и повтори попытку, пока она не увенчается успехом

## Документация
Документация хранится в папке `docs`.
1. `docs/projectbrief.md` - Краткое описание проекта.
2. `docs/productContext.md` - Описание продукта и его контекста.
3. `docs/systemPatterns.md` - Описание программных и системных шаблонов и их применения.
4. `docs/techContext.md` - Описание технологического стека.

<!-- bv-agent-instructions-v1 -->

---

## Beads Workflow Integration

This project uses [beads_viewer](https://github.com/Dicklesworthstone/beads_viewer) for issue tracking. Issues are stored in `.beads/` and tracked in git.

### Essential Commands

```bash
# View issues (launches TUI - avoid in automated sessions)
bv

# CLI commands for agents (use these instead)
bd ready              # Show issues ready to work (no blockers)
bd list --status=open # All open issues
bd show <id>          # Full issue details with dependencies
bd create --title="..." --type=task --priority=2
bd update <id> --status=in_progress
bd close <id> --reason="Completed"
bd close <id1> <id2>  # Close multiple issues at once
bd sync               # Commit and push changes
```

### Workflow Pattern

1. **Start**: Run `bd ready` to find actionable work
2. **Claim**: Use `bd update <id> --status=in_progress`
3. **Work**: Implement the task
4. **Complete**: Use `bd close <id>`
5. **Sync**: Always run `bd sync` at session end

### Key Concepts

- **Dependencies**: Issues can block other issues. `bd ready` shows only unblocked work.
- **Priority**: P0=critical, P1=high, P2=medium, P3=low, P4=backlog (use numbers, not words)
- **Types**: task, bug, feature, epic, question, docs
- **Blocking**: `bd dep add <issue> <depends-on>` to add dependencies

### Session Protocol

**Before ending any session, run this checklist:**

```bash
git status              # Check what changed
git add <files>         # Stage code changes
bd sync                 # Commit beads changes
git commit -m "..."     # Commit code
bd sync                 # Commit any new beads changes
git push                # Push to remote
```

### Best Practices

- Check `bd ready` at session start to find available work
- Update status as you work (in_progress → closed)
- Create new issues with `bd create` when you discover tasks
- Use descriptive titles and set appropriate priority/type
- Always `bd sync` before ending session

<!-- end-bv-agent-instructions -->
