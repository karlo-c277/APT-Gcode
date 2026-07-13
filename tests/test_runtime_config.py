import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from apt_gcode_startup import normalize_input_path, parse_yes_no


def test_normalize_input_path_adds_text_extension():
    assert normalize_input_path("sample") == "sample.txt"


def test_parse_yes_no_handles_common_values():
    assert parse_yes_no("1") is True
    assert parse_yes_no("YES") is True
    assert parse_yes_no("0") is False
    assert parse_yes_no("NO") is False
