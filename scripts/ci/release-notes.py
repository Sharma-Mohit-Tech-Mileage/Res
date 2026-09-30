"""Generate release notes from the source commit, without executing commit text."""
import os
from pathlib import Path
import subprocess


def notes(message):
    message = message.strip()
    if not message:
        raise ValueError('The source commit message is empty')
    return {
        'testflight.txt': message[:4000],
        'android.txt': message[:300],
        'pr-title.txt': message.splitlines()[0][:400],
        'pr-description.md': message,
    }


if __name__ == '__main__':
    # PR validation checks out a synthetic merge. Use the actual source commit.
    commit = os.environ.get('SYSTEM_PULLREQUEST_SOURCECOMMITID') or os.environ['BUILD_SOURCEVERSION']
    message = subprocess.check_output(['git', 'show', '-s', '--format=%B', commit], text=True)
    directory = Path(os.environ['BUILD_ARTIFACTSTAGINGDIRECTORY']) / 'release-notes'
    directory.mkdir(parents=True, exist_ok=True)
    for filename, content in notes(message).items():
        (directory / filename).write_text(content, encoding='utf-8')
    print('Generated TestFlight notes, Android notes (maximum 300 characters), PR title and description.')
