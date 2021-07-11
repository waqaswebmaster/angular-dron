(function () {
    $(document).ready(function () {
        $('#public-access-modal input#expired-custom').datetimepicker({
            minDate: 0,
            startDate: new Date(),
            format: 'Y-m-d H:i',
        });

        var _link;
        var _email;

        $('#public-access-modal select#id_link').on('change', function (event) {
            _link = event.target.value

            $.get(LINK_PUBLICACCESS_URL + '?link=' + _link, function (data) {
                $('.access-list-table tbody').html('')

                if (data.length) {
                    $('.access-list-table').show()
                    $('.empty-table').hide()
                    for (let i = 0; i < data.length; i++) {
                        $('.access-list-table tbody').append(getRow(data[i]))
                    }
                } else {
                    $('.access-list-table').hide()
                    $('.empty-table').show()
                }
            })
        })

        $('#public-access-modal select#expired').on('change', function (event) {
            if (event.target.value === 'custom') {
                $('.expired-custom-row').show()
                $('#public-access-modal input#expired-custom').datetimepicker('show');
                $('#public-access-modal input#expired-custom').val(moment().utc().format('YYYY-MM-DD HH:mm'))
                console.log(jQuery('#public-access-modal input#expired-custom').val())
            } else {
                $('.expired-custom-row').hide()
            }
        })

        $('#public-access-modal input#email').on('change', function (event) {
            _email = event.target.value
        })

        $('#public-access-modal .btn-primary').on('click', function (event) {
            var _expired = null;
            var option = $('#public-access-modal select#expired').val()
            if (option === '10m') {
                _expired = moment().add(10, 'm').utc().format('YYYY-MM-DD HH:mm')
            } else if (option === '30m') {
                _expired = moment().add(30, 'm').utc().format('YYYY-MM-DD HH:mm')
            } else if (option === '1h') {
                _expired = moment().add(1, 'h').utc().format('YYYY-MM-DD HH:mm')
            } else if (option === '24h') {
                _expired = moment().add(24, 'h').utc().format('YYYY-MM-DD HH:mm')
            } else if (option === 'custom') {
                _expired = $('#public-access-modal input#expired-custom').val()
            }

            $.post(LINK_PUBLICACCESS_URL, {
                'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
                'link': _link,
                'email': _email,
                'expired': _expired,
            }, function (data) {
                $('.email-error').hide()
                $('.link-error').hide()
                $('.expired-error').hide()
                $('.common-error').hide()
                $('.empty-table').hide()
                $('.access-list-table').show()
                $('.access-list-table tbody').append(getRow(data))
            }).fail(function (data) {
                if (data && data.responseJSON) {
                    if (data.responseJSON['email']) {
                        $('.email-error').text(data.responseJSON['email'][0])
                        $('.email-error').show()
                    }
                    if (data.responseJSON['smartlink']) {
                        $('.link-error').text(data.responseJSON['smartlink'][0])
                        $('.link-error').show()
                    }
                    if (data.responseJSON['expired']) {
                        $('.expired-error').text(data.responseJSON['expired'][0])
                        $('.expired-error').show()
                    }
                    if (data.responseJSON['detail']) {
                        $('.common-error').text(data.responseJSON['detail'])
                        $('.common-error').show()
                    }
                } else {
                    $('.common-error').text('Error')
                    $('.common-error').show()
                }
            })
        })

        $('#public-access-modal').on('click', '.remove-share', function (event) {
            var $target = $(event.target)
            var token = $target.data('token');

            $.ajax({
                url: LINK_PUBLICACCESS_URL + token + '/',
                headers: {"X-CSRFToken": $('input[name=csrfmiddlewaretoken]').val()},
                type: 'DELETE',
                success: function (response) {
                    $target.closest('tr').remove()
                    $('.common-error').hide()
                },
                error: function (error) {
                    $('.common-error').text('Error')
                    $('.common-error').show()
                }
            })
        })

        $('#public-access-modal').on('click', '.copy-to-clipboard', function (event) {
            copyToClipboard(location.origin + $(event.target).data('url'))
        })

        $('#public-access-modal').on('hidden.bs.modal', function (event) {
            _email = undefined;

            $('.email-error').hide()
            $('.link-error').hide()
            $('.expired-error').hide()
            $('.common-error').hide()
            $('.expired-custom-row').hide()

            $('#public-access-modal select#id_link').val(undefined)
            $('#public-access-modal input#expired-custom').val(undefined)
            $('#public-access-modal input#email').val(undefined)
            $('#public-access-modal select#expired').val('30m')
        })


        const copyToClipboard = str => {
            navigator.clipboard.writeText(str);
        };

        const getRow = row => {
            return `<tr>
                        <td style="width: 60%">
                            ${row.email}<br>
                            <span class="small text-secondary">
                                <a href="/live-public/${row.token}" target="_blank">${row.token}</a>
                            </span>
                            <i class="far fa-copy px-1 copy-to-clipboard" data-url="/live-public/${row.token}" style="cursor: pointer"></i>
                        </td>
                        <td style="width: 35%">${moment(row.expired).utc().format('Y-MM-DD HH:mm')}</td>
                        <td style="width: 5%;">
                            <i class="fas fa-trash-alt remove-share" style="cursor: pointer" data-token="${row.token}"></i>
                        </td>
                    </tr>`
        }
    })
})()