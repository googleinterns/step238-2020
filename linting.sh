echo "CSS linting check started"
git diff --diff-filter=ACM --name-only origin/master HEAD -- . ':!node_modules' | grep -E "(.*)\.(css|htm|html)$" | xargs --no-run-if-empty npx stylelint
echo "CSS linting check finished"

echo "JS linting check started"
git diff --diff-filter=ACM --name-only origin/master HEAD -- . ':!node_modules' | grep -E "(.*)\.(jsx|js)$" | xargs --no-run-if-empty npx eslint
echo "JS linting check finished"

echo "HTML linting check started"
git diff --diff-filter=ACM --name-only origin/master HEAD -- . ':!node_modules' | grep -E "(.*)\.(htm|html)$" | xargs --no-run-if-empty npx htmllint
echo "HTML linting check finished"

echo "Java linting check started"

for file in $(git diff --name-only origin/master HEAD -- . ':!node_modules' | grep -E "(.*)\.(java)$"); do
  echo -e "Running google-java-format on:\n $file\n"
  if ! java -jar ./google-java-format-1.7-all-deps.jar $file | diff $file -; then
    EXIT=1
  fi
  echo "" 
done
echo "Java linting check finished"

exit $EXIT
