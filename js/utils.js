$(function () {
	
	const rows = 9
	const cows = 9
	const numbers = 50  // 生成的危险数字个数
	
	let emptyCellValue = {}  // 可输入格子的正确值
	
	let errorNumbers = []
	
	let input_rindex = 0
	let input_cindex = 0
	
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
	 * 获取当前点击的单元格索引 
	 * @param clickedObj 被点击的对象
	*/
	function getCurrentClickCell (clickedObj) {
		input_cindex = $(clickedObj).index() + 1
		
		input_rindex = $(clickedObj).parent().index() + 1
		
		console.log("当前点击的位置:", input_rindex, input_cindex)
	}
	
	
	/**
	 * 输入框的所有事件
	*/
    function inputBindEvents () {
		
		// 清空错误信息内容
		logErrorMessage("")
		
		/**
		 * 检查输入的值
		 * @param StringValue 待检查的数字
		*/
		function validateInputValue (StringValue) {
			let isValidate = false
			let intValue = 0
			
			// 1、空值检查
			if (String(StringValue).length === 0) {
				return false
			}
			
			// 2、非数字检查
			try{
				intValue = parseInt(StringValue)
			}catch(e){
				intValue = 0
				logErrorMessage("只允许输入1~9的整数!")
			}
			// 3、非整数检查
			if (String(intValue) === StringValue && intValue > 0 && intValue < 10) {
				
				if (checkRowAndCowNumber(input_rindex, input_cindex, intValue)) {
					logErrorMessage(`当前行或列已存在相同数字: ${StringValue}`)
				} else if (checkNumberExistAear(input_rindex, input_cindex, intValue)){
					logErrorMessage(`当前九宫格内已存在相同数字: %{StringValue}`)
				} else {
					isValidate = true
				}
				
			} else {
				logErrorMessage("只允许输入1~9的整数!")
			}
			
			return isValidate
		}
		
		/**
		 * 监听输入的内容,只允许输入0-9的数字 
		*/
		$('.inputBodyClass').keyup(function () {
			const inputValue = parseInt($(this).val())
			if (inputValue > 0 && inputValue < 10) {
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
					
			let validate_input_result = validateInputValue(inputValue)
				
			console.log(validate_input_result, "检查结果")
			
			// 检查当前输入框原先是否有值
			const existValue = $(this).parent().find('span.inputValueActivate').length > 0
			
			if (existValue) {
				if (validate_input_result && inputValue) {
					$(this).parent().find('.inputValueActivate').text(inputValue).removeClass('d-none')
				} else {
					$(this).parent().find('.inputValueActivate').removeClass('d-none')
				}
			} else if (validate_input_result) {
				$(this).parent().append('<span class="inputValueActivate">' + inputValue + '</span>')
			}
			
			// 脱离聚焦后,删除全部输入框
			$(this).parent().find('input').remove()
			// 在同一个单元格输入数字时,前一个数字需要清除
			if ($(this).find('.inputValueActivate').css('display') === 'none') {
				$(this).find('.inputValueActivate').remove()
			}
		})
	}
	
	
	/**
	 * 生成随机数
	*/
	function randomNumber () {
		return parseInt(Math.random() * 9) + 1
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
				
		let currentRows = $('.row').eq(rowIndex - 1)
				
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
				
		const y_numbers = findLocationAear(rowIndex)
		const x_numbers = findLocationAear(cowIndex)
		for (let row_index in y_numbers) {
			for (let cow_Index in x_numbers) {
				const current_cell_text = $('.row').eq(y_numbers[row_index] - 1).find('.cow').eq(x_numbers[cow_Index] - 1).text()
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
			
			getCurrentClickCell(this)
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

			n = 0
			
			while (n < maxTimes) {
				// 2. 生成数字
				const tmpNumber = randomNumber()
				
				// 3. 判断是否在当行重复出现该数字
				if (!checkRowAndCowNumber(rowIndex, cowIndex, tmpNumber) && !checkNumberExistAear(rowIndex, cowIndex, tmpNumber)) {
					insetNumberToCow(tmpNumber, rowIndex, cowIndex)
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
	 * 按钮事件集合
	*/
	function button_events () {
		
		// 清空输入
		$('.clear_input_values').click(function () {
			if (confirm("是否清空输入的内容?")) {
				$('.inputValueActivate').remove()
			}
		})
		
		// 重新开始游戏
		$('.reset_game').click(function () {
			if (confirm("是否重新开始游戏?")) {
				main()
			}
		})
	}
	
	
	/**
	 * 主入口执行函数
	*/
	function main () {
		createChildrens()
		clickCow()
		randomNumberToAear()
		button_events()
	}
	main()
})
