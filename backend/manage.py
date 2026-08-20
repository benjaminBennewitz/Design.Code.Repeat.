#!/usr/bin/env python3
"""Django-Verwaltungseinstieg des Studio-Backends."""

import os
import sys


def main() -> None:
    """Startet Django-Management-Kommandos mit der Studio-Konfiguration."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
