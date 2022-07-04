$(function () {
	
	const rows = 9
	const cows = 9
	const numbers = 10  // 生成的危险数字个数
	
	let emptyCellValue = {}  // 可输入格子的正确值
	
	let errorNumbers = []
	
	$gameBody = $('.game_main')
	
	
	/**
	 * 创建游戏方块
	*/
	function createChildrens () {
		$gameBody.find('.row').remove()
		
		for (let row=0; row < rows; row++) {
			let $rowObj = $('<div>')
			$rowObj.addClass('row')
			for (let cow=0; cow < cows; cow++) {
				let $cowObj = $('<div>')
				$cowObj.addClass('cow')
				$rowObj.append($cowObj)
			}
			$gameBody.append($rowObj)
		}
	}
	
	
	/**
	 * 打印错误信息
	*/
	function logErrorMessage (message) {
		$('.erroInfo').html(message)
	}
	
	
	/**
	 * 生成输入框
	*/
	function createInputDocument (currentCow) {
		
		if ($(currentCow).find('intput').length == 0) {
			
			// 检查是否已存在输入值
			const inputValueObj = $(currentCow).find('span.inputValueActivate')
			if (inputValueObj.length > 0) {
				inputValueObj.addClass('d-none')
			}
			
			const inputObj = $('<input>').addClass('inputBodyClass')
			$(currentCow).append(inputObj)
		}
		
		$('.inputBodyClass').focus()
		inputBindEvents()
	}
	
	
	/**
	 * 输入框的所有事件
	*/
    function inputBindEvents () {
		
		// 清空错误信息内容
		logErrorMessage("")
		
		/**
		 * 监听输入的内容,只允许输入0-9的数字 
		*/
		$('.inputBodyClass').keyup(function () {
			const inputValue = parseInt($(this).val())
			if (inputValue > 0 && inputValue < 9) {
				$(this).val(inputValue)
			} else {
				$(this).val('')
				logErrorMessage("只允许填写1~9的数字")
			}
		})
		
		/**
		 * 输入完成后,脱离聚焦将输入的内容展示出来 
		*/
		$('.inputBodyClass').blur(function () {
			const inputValue = $(this).val()
			
			// 表示是否存在之前输入的值
			const existValue = $(this).parent().find('span.inputValueActivate').length > 0
			
			if (existValue) {
				if (inputValue) {
					$(this).parent().find('.inputValueActivate').text(inputValue).removeClass('d-none')
				} else {
					$(this).parent().find('.inputValueActivate').removeClass('d-none')
				}
			} else {
				$(this).parent().append('<span class="inputValueActivate">' + inputValue + '</span>')
			}
			
			// 脱离聚焦后,删除全部输入框
			$(this).parent().find('input').remove()
		})
	}
	
	
	/**
	 * 生成随机数
	*/
	function randomNumber () {
		return parseInt(Math.random() * 9) + 1
	}
	
	
	/**
	 * 检查是否是需要填写的单元格
	*/
	function isNeedInputLocation (rIndex, cIndex) {
		return emptyCellValue.hasOwnProperty(`${rIndex},${cIndex}`)
	}
	
	
	/**
	 * 检查行和列是否重复
	 * @param rowIndex 指定行
	 * @param cowIndex 指定列
	 * @param num 检查的数字
	 * @return 
	 *   true - 有重复数字
	 *   false - 无重复数字
	*/
    function checkRowAndCowNumber (rowIndex, cowIndex, num) {
		
		if (isNeedInputLocation(rowIndex, cowIndex)) return false
		
		let currentRows = $('.row').eq(rowIndex - 1)
		
		// console.log(rowIndex, cowIndex, num, currentRows.text());
		
		if(currentRows.text().indexOf(num) > -1) {
			return true
		}
		
		for (var i = 0; i < rows; i++) {
			const tmpCow = $('.row').eq(i).find('.cow').eq(cowIndex - 1)
			if (tmpCow.text().indexOf(num) > -1) {
				return true
			}
		}
		return false
	}
	
	
	/**
	 * 计算 index 的所属九宫格的取值范围
	 * @param numberIndex 索引
	*/
    function findLocationAear (numberIndex) {
		// 基准数字, 用于判断所在九宫格
		const indexTargetNumbers = [2, 5, 8]
		
		let index_numbers = []
		
		for (let index in indexTargetNumbers) {
			if (numberIndex == indexTargetNumbers[index]) {
				return [numberIndex - 1, numberIndex, numberIndex + 1]
			} else if (numberIndex < indexTargetNumbers[index]) {
				if (index == 0) {
					index_numbers = [1, 2, 3]
				} else if ((numberIndex + 1) == indexTargetNumbers[index]) {
					index_numbers = [numberIndex, numberIndex + 1, numberIndex + 2]
				} else {
					index_numbers = [numberIndex - 2, numberIndex - 1, numberIndex]
				}
				return index_numbers
			}
		}		
	}
	
	
	/**
	 * 检查九宫格内数字是否重复
	 * @param rowIndex 行索引
	 * @param cowIndex 列索引
	 * @param num 待检查的数字
	 * @return 
	 *   true - 当前九宫格内存在相同数字
	 *   false - 反之, 则无
	*/
    function checkNumberExistAear (rowIndex, cowIndex, num) {
		
		if (isNeedInputLocation(rowIndex, cowIndex)) return false
		
		const y_numbers = findLocationAear(rowIndex)
		const x_numbers = findLocationAear(cowIndex)
		// console.log(">>>>开始检查数字:", num, "\t\t位置:", rowIndex, cowIndex);
		for (let row_index in y_numbers) {
			for (let cow_Index in x_numbers) {
				const current_cell_text = $('.row').eq(y_numbers[row_index] - 1).find('.cow').eq(x_numbers[cow_Index] - 1).text()
				// console.log("\t\t+++检查第" + y_numbers[row_index] + "行,第" + x_numbers[cow_Index] + "列, 当前文本:", current_cell_text);
				if (current_cell_text.indexOf(num) > -1) {
					return true
				}
			}
		}
		return false
	}
   
	
	/**
	 * 将数字放到指定位置
	 * @param cowNumber 指定行
	 * @param num 检查的数字
	*/
	function insetNumberToCow (num, rowIndex, cowIndex) {
		$('.row').eq(rowIndex - 1).find('.cow').eq(cowIndex - 1).html('<span class="activate">' + num + '</span>')
	}
	
	
	/**
	 * 点击单元格事件
	*/
    function clickCow () {
		$('.cow').click( function () {
			
			// 指定位置才允许输入数字
			if ($(this).find('span.activate').length == 0) {
				createInputDocument(this)
			}
		})
	}
	
	
	/**
	 * 随机生成雷区
	*/
	function randomNumberToAear () {
		
		const maxTimes = 10
		
		for (var i = 0; i < numbers; i++) {
			// 1. 生成位置
			const rowIndex = randomNumber()
			const cowIndex = randomNumber()
			
			// console.log(rowIndex, cowIndex);
			n = 0
			
			while (n < maxTimes) {
				// 2. 生成数字
				const tmpNumber = randomNumber()
				
				// 3. 判断是否在当行重复出现该数字
				if (!checkRowAndCowNumber(rowIndex, cowIndex, tmpNumber) && !checkNumberExistAear(rowIndex, cowIndex, tmpNumber)) {
					insetNumberToCow(tmpNumber, rowIndex, cowIndex)
					// console.log("\t<<<成功插入数字:", tmpNumber, "位置: ", rowIndex, cowIndex);
					errorNumbers.push(tmpNumber)
					
					break
				}
				
				n ++
			}
		}
	}
	
	/**
	 * 指定位置添加和删除数字
	 * @param rIndex 行索引
	 * @param cIndex 列索引
	 * @param num 数字
	 * @param operation 操作
	*/
	function createAndRemoveValue (rIndex, cIndex, num, operation='add') {
		let targetCellObj = $('.row').eq(rIndex - 1).find('.cow').eq(cIndex - 1)
		if (operation == 'add') {
			if (targetCellObj.find('span').length > 0) {
				targetCellObj.find('span').text(num)
			} else {
				targetCellObj.append('<span class="tmpNum">' + num + '</span>')
			}
		} else {
			targetCellObj.find('span').remove()
		}
	}
	
	
	/**
	 * 遍历所有格子, 找出所有可输入的格子
	*/
	function findAllowInputCells () {
		for (let rowIndex = 1; rowIndex < 10; rowIndex++) {
			for (var cowIndex = 1; cowIndex < 10; cowIndex++) {
				let cellObj = $('.row').eq(rowIndex - 1).find('.cow').eq(cowIndex - 1)
				
				// 空格子
				if (cellObj.find('span').length === 0) {
					emptyCellValue[`${rowIndex},${cowIndex}`] = ''
				}
			}
		}
	}
	
	
	/**
	 * 计算当前生成的数独正确答案
	 * @param allEmptyCells 需要模拟填写的空格子
	 * @return 
	 *   true - 表示当前数独可以计算出正确结果
	 *   false - 反之, 则无
	*/
    function computedValidateAnsower (allEmptyCells) {
		
		let backupValue = JSON.parse(JSON.stringify(allEmptyCells))
		
		console.log('======', backupValue);
		
		for (let rowAndCowIndex in backupValue) {
			const tmpIndex = rowAndCowIndex.split(',')
			const rIndex = tmpIndex[0]
			const cIndex = tmpIndex[1]
			
			console.log('检查位置:', rIndex, cIndex);
			
			
			// 模拟填写数字
			for (var num = 1; num < 9; num++) {
				
				createAndRemoveValue(rIndex, cIndex, num - 1, 'remove')
				
				// 先填写临时数字
				createAndRemoveValue(rIndex, cIndex, num)
				
				// console.log(rIndex, cIndex, num, checkRowAndCowNumber(rIndex, cIndex, num))
				
				if (!checkRowAndCowNumber(rIndex, cIndex, num) && !checkNumberExistAear(rIndex, cIndex, num)) {
					console.log('------可以填写数字: ', num);
					backupValue[rowAndCowIndex] = num
					break
				}
				
				// debugger
				
				// 删除填写的临时数字
				// createAndRemoveValue(rIndex, cIndex, num, 'remove')
			}
			
			if (backupValue[rowAndCowIndex].length == 0) {
				console.log('!!!存在一个位置不能填写任何值:', rIndex, cIndex);
				break
			}
			
		}
	}
	
	
	/**
	 * 主入口执行函数
	*/
	function main () {
		createChildrens()
		clickCow()
		randomNumberToAear()
		
		findAllowInputCells()
		computedValidateAnsower(emptyCellValue)
	}
	main()
})
