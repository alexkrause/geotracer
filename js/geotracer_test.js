module("ok speed tests");
test( "calculateTotalSpeedTest", function() {
	var speed = calculateTotalSpeed(100, 1000*60*60);
	equal( speed, 100, "Passed!" );
});

test( "calculateTotalSpeedTest2", function() {
	var speed = calculateTotalSpeed(100, 1000*60*30);
	equal( speed, 200, "Passed!" );
});

module("null speed tests");
test( "calculateTotalSpeedNullTest", function() {
	var speed = calculateTotalSpeed(100, null);
	equal(speed,0, "Passed!" );
});

test( "calculateTotalSpeedNullTest2", function() {
	var speed = calculateTotalSpeed(null, 1000);
	ok( speed == 0, "Passed!" );
});

test( "calculateTotalSpeedNullTest3", function() {
	var speed = calculateTotalSpeed(null, null);
	ok( speed == 0, "Passed!" );
});