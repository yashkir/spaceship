test:
	@echo "Starting reload (node.js) for live preview..."
	@echo "available at https://www.npmjs.com/package/reload"
	reload -w js -w css/ -w . -b

release:
	mkdir release
	cp index.html release/
	cp -r js/ release/
	cp -r css/ release/

clean:
	rm -rf release
